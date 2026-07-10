#!/bin/bash
set -o pipefail
shopt -s extglob globstar nocaseglob

input_dir='input'
json_file='src/assets/photos.json'
json_tmp="${json_file}.tmp"
height='1600'
had_errors=0

# Validate required commands
for cmd in magick identify exiftool gawk; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "ERROR: Required command '$cmd' not found in PATH" >&2
    exit 1
  fi
done

# Validate input directory
if [[ ! -d "$input_dir" ]]; then
  echo "ERROR: Input directory '$input_dir' does not exist" >&2
  exit 1
fi

rm -f "$json_tmp"
printf "[\n" > "$json_tmp"

for file in "$input_dir"/**/*.@(jpg|jpeg|heic); do
  (
    basename_file=$(basename "$file")

    # Skip macOS ._* artifact files
    if [[ $basename_file == ._* ]]; then
      echo "  ⚠️  Skipping artifact: $file"
      exit 0
    fi

    # Skip non-regular files
    if [[ ! -f "$file" ]]; then
      echo "  ⚠️  Skipping non-regular file: $file"
      exit 0
    fi

    filename=${basename_file%.*}
    echo "Processing: $filename"

    # Validate and extract year/month from filename
    if [[ ! $filename =~ ^([0-9]{4})[-_]?([0-9]{2}) ]]; then
      echo "  ⚠️  Cannot extract year/month from filename, skipping: $file" >&2
      exit 0
    fi
    year=${BASH_REMATCH[1]}
    month=${BASH_REMATCH[2]}

    # Validate year and month
    month_num=$((10#$month))
    if [[ $year -lt 2000 || $year -gt 2099 ]]; then
      echo "  ⚠️  Invalid year '$year' from filename, skipping: $file" >&2
      exit 0
    fi
    if [[ $month_num -lt 1 || $month_num -gt 12 ]]; then
      echo "  ⚠️  Invalid month '$month' from filename, skipping: $file" >&2
      exit 0
    fi

    dir_grid="grid/$year/$month"
    output_dir_grid="public/$dir_grid"
    dir_lightbox="lightbox/$year/$month"
    output_dir_lightbox="public/$dir_lightbox"

    if ! mkdir -p "${output_dir_grid}" "${output_dir_lightbox}"; then
      echo "  ⚠️  Cannot create output directories: $file" >&2
      exit 1
    fi

    if [[ ! -s "${output_dir_grid}/${filename}.jpg" ]]; then
      echo "  Running ImageMagick"
      magick "$file" -auto-orient -thumbnail 600x600^ -interpolate catrom -gravity center -extent 600x600 -quality 80 "${output_dir_grid}/${filename}.jpg" || exit 1
      magick "$file" -resize "x${height}" -interpolate catrom -quality 85 "${output_dir_lightbox}/${filename}.jpg" || exit 1
    fi

    width=$(identify -ping -format '%[width]' "${output_dir_lightbox}/${filename}.jpg" 2>/dev/null || echo "0")
    if [[ ! $width =~ ^[0-9]+$ ]]; then
      width=0
    fi

    printf "  %s\n" "{" \
      "  \"year\" : $year," \
      "  \"grid\" : \"${dir_grid}/${filename}.jpg\"," \
      "  \"lightbox\" : \"${dir_lightbox}/${filename}.jpg\"," \
      "  \"width\" : $width," \
      "  \"height\" : $height," >> "$json_tmp"

    echo "  Running exiftool"
    exiftool -q -t -d "%Y-%m-%d %H:%M:%S" -CreateDate -Make -Model -LensModel -FocalLengthIn35mmFormat -ApertureValue -ExposureTime -ISO -Flash "$file" 2>/dev/null \
    | awk -F '\t' '
    function trim(field) {
      gsub(/^[ \t]+/, "", field); gsub(/[ \t]+$/, "", field)
      return field
    }
    function removeWhitespaces(field) {
      gsub(/[ \t]+/, "", field)
      return field
    }
    function correctValue(key, value) {
      # Lens name corrections based on known camera reporting issues
      if (key == "lensmodel" && value == "65 mm f/--") return "Laowa 65mm f/2.8 2x Ultra Macro APO"
      if (key == "lensmodel" && value == "12 mm f/--") return "Walimex pro 12mm f/2.0"
      # Aperture correction: some cameras report f/1.0 when f/5.6
      if (key == "aperturevalue" && value == "1.0") return "5.6"
      return value
    }
    {
      key = tolower(removeWhitespaces($1))
      value = correctValue(key, trim($2))
      if (value == "-") value = ""
      printf "    \"%s\" : \"%s\",\n", key, value
    }' >> "$json_tmp"

    # Escape special characters in the file path for JSON
    escaped_file=$(printf '%s' "$file" | sed 's/\\/\\\\/g; s/"/\\"/g')
    printf "    %s\n" "\"file\" : \"$escaped_file\"" "}," >> "$json_tmp"
    echo "  ✅  done"
  )
  if [[ $? -ne 0 ]]; then
    echo "  ⚠️  Error processing $file, continuing..." >&2
    had_errors=1
  fi
done

# Close JSON array, then fix trailing comma before closing bracket
printf "\n]" >> "$json_tmp"
gawk -i inplace -v RS='^$' '{
  gsub(/,[[:space:]]*\n[[:space:]]*]/, "\n]")
} 1' "$json_tmp"

# Validate JSON syntax
if command -v jq &>/dev/null; then
  if jq . "$json_tmp" >/dev/null 2>&1; then
    mv "$json_tmp" "$json_file"
    echo "✅ JSON valid — written to $json_file"
  else
    echo "ERROR: Generated JSON is invalid — check $json_tmp" >&2
    exit 1
  fi
else
  mv "$json_tmp" "$json_file"
  echo "⚠️  jq not found — JSON written without validation to $json_file"
fi

if [[ $had_errors -eq 1 ]]; then
  echo "⚠️  Completed with errors (see above)"
fi
