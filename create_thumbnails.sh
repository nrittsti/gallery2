#!/bin/bash
set -e -o pipefail
shopt -s extglob globstar

input_dir='input'
json_file='src/assets/photos.json'
height='1600'

rm -f $json_file
printf "[\n" > "$json_file"

for file in "$input_dir"/**/*.@(jpg|HEIC); do
  filename=$(echo "$file" | awk -F '/' '{print $NF}' | awk -F '.' '{print $1}') # remove path and extension
  echo "Processing: $filename"
  year=${filename:0:4}
  month=${filename:5:2}
  dir_grid="grid/$year/$month"
  output_dir_grid="public/$dir_grid"
  dir_lightbox="lightbox/$year/$month"
  output_dir_lightbox="public/$dir_lightbox"
  mkdir -p "${output_dir_grid}"
  mkdir -p "${output_dir_lightbox}"
  if [[ ! -s "${output_dir_grid}/${filename}.jpg" ]] ; then
    echo "  Running ImageMagick"
    magick "$file" -auto-orient -thumbnail 600x600^ -interpolate catrom -gravity center -extent 600x600 -quality 80 "${output_dir_grid}/${filename}.jpg"
    magick "$file" -resize "x${height}" -interpolate catrom -quality 85 "${output_dir_lightbox}/${filename}.jpg"
  fi
  width=$(identify -ping -format '%[width]' "${output_dir_lightbox}/${filename}.jpg")

  printf "  %s\n" "{" \
  "  \"year\" : $year," \
  "  \"grid\" : \"${dir_grid}/${filename}.jpg\"," \
  "  \"lightbox\" : \"${dir_lightbox}/${filename}.jpg\"," \
  "  \"width\" : $width," \
  "  \"height\" : $height," >> "$json_file"

  echo "  Running exiftool"
  exiftool -t -d "%Y-%m-%d %H:%M:%S" -CreateDate -Make -Model -LensModel -FocalLengthIn35mmFormat -ApertureValue -ExposureTime -ISO -Flash "$file" \
  | awk -F '\t' 'function trim(field){
      gsub(/^[ \t]+/, "", field); gsub(/[ \t]+$/, "", field);
      return field
    } function removeWhitespaces(field){
      gsub(/[ \t]+/, "", field);
      return field
    }
    {printf "    \"%s\" : \"%s\",\n", tolower(removeWhitespaces($1)), trim($2)}' >> "$json_file"

  printf "    %s\n" "\"file\" : \"""$file""\""  "}," >> "$json_file"
  echo "  ✅  done"
done
printf "]" >> "$json_file"

gawk -i inplace -v RS='^$' '
{
    # The last element in an array should NOT have a trailing comma.
    # This gsub command finds and removes the trailing comma before the closing ] bracket.
    gsub(/},\n]/, "}\n]")

    # Correct some lens definitions
    gsub(/65 mm f\/--/, "Laowa 65mm f/2.8 2x Ultra Macro APO")
    gsub(/12 mm f\/--/, "Walimex pro 12mm f/2.0")
    gsub(/1\.0/, "5.6")
}
1' "$json_file"
