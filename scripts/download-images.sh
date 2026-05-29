#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/img/civs assets/img/events
UA="CrononautaBot/1.0 (https://crononauta.neracosu.com; neracosu@gmail.com)"

declare -A CIV=(
  [sumer]="e/e4/Standard_of_Ur_-_War.jpg" [egypt]="e/e3/Kheops-Pyramid.jpg"
  [akkad]="4/50/Victory_stele_of_Naram_Sin_9068.jpg" [babylon]="5/52/Hanging_Gardens_of_Babylon.jpg"
  [assyria]="a/a0/Human_headed_winged_bull_facing.jpg" [hittites]="Lion_Gate,_Hattusa_13_(cropped).jpg"
  [phoenicia]="4/4e/Phoenician_ship.jpg" [israel]="Westernwall2.jpg"
  [persia]="5/5b/Persepolis_24.11.2009_11-12-14.jpg" [parthia]="Ctesiphon_map-en_reformat.svg"
  [sassanid]="تاق‌بستان.jpg"
  [caliphate]="Mezquita_de_Córdoba_desde_el_aire_(Córdoba,_España).jpg" [ottoman]="SüleymaniyeMosqueIstanbul_(cropped).jpg"
  [minoan]="Knossos_bull_leaping_fresco.jpg" [mycenae]="5/55/MaskOfAgamemnon.jpg"
  [greece]="d/da/The_Parthenon_in_Athens.jpg" [rome]="d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg"
  [byzantine]="2/22/Hagia_Sophia_Mars_2013.jpg"
  [frankish]="6/66/Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg"
  [hre]="Charlemagne_denier_Mayence_812_814.jpg"
  [england]="b/be/Palace_of_Westminster%2C_London_-_Feb_2007.jpg" [spain]="4/44/Alhambra-Granada.jpg"
  [russia]="d/d4/Moscow_July_2011-7a.jpg" [portugal]="7/72/Torre_de_Bel%C3%A9m_-_Lisboa.jpg"
  [viking]="c/c1/Gokstadskipet1.jpg" [indus]="f/f3/Mohenjodaro_-_view_of_the_stupa_mound.JPG"
  [china_ancient]="The_Great_Wall_of_China_at_Jinshanling-edit.jpg" [india]="b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg"
  [japan]="Matsumoto_Castle_Keep_Tower.jpg" [mongol]="3/35/YuanEmperorAlbumGenghisPortrait.jpg"
  [korea]="광화문_월대.jpg" [carthage]="b/b5/Tunisie_Carthage_Ruines_08.JPG"
  [ethiopia]="7/7a/Stela_aksum.jpg" [ghana]="Djingareiber_cour.jpg"
  [olmec]="9/9d/Olmec_Head_from_San_Lorenzo%2C_Veracruz.jpg" [maya]="1/10/Chichen_Itza_3.jpg"
  [aztec]="b/b4/Sunstone.jpg" [inca]="1/13/Before_Machu_Picchu.jpg"
  [netherlands]="La_ronda_de_noche,_por_Rembrandt_van_Rijn.jpg"
  [prussia]="b/b1/Anton_von_Werner_-_Kaiserproklamation_am_18._Januar_1871_%283._Fassung_1885%29.jpg"
  [usa]="1/11/Constitution_We_the_People.jpg" [italy_unified]="2/2c/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg"
)
# Vía estable: Special:FilePath redirige al thumbnail (el path /thumb/ directo da 400).
for id in "${!CIV[@]}"; do
  path="${CIV[$id]}"; file="${path##*/}"
  url="https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=400"
  echo "civs/$id"; curl -sL -A "$UA" -o "assets/img/civs/${id}.jpg" "$url" || echo "  ⚠ falló $id"
done

# Optimizar si hay ImageMagick
if command -v mogrify >/dev/null; then
  mogrify -resize 400x -quality 80 assets/img/civs/*.jpg || true
fi
echo "Listo. Revisa assets/img/civs/"
