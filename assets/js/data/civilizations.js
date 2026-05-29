// Año negativo = a.C. tier: 1 mayor · 2 media · 3 menor. rise: años de crecimiento (opcional).
// parent: id de la civ de la que deriva (dibuja conector río).
export const CIVS = [
  // RELATO BÍBLICO — patriarcas (region 6). Años según la cronología de Ussher
  // (la misma que usa el mapa original de Adams). start=nacimiento, end=muerte.
  { id:'adam', name:'Adán', start:-4004, end:-3074, color:'#8a5a2b', region:6, tier:3, desc:'Primer hombre según el Génesis. Vivió 930 años. Cronología de Ussher (Anno Mundi 1).' },
  { id:'seth', name:'Set', start:-3874, end:-2962, color:'#96652f', region:6, tier:3, desc:'Tercer hijo de Adán y Eva. Vivió 912 años.' },
  { id:'enos', name:'Enós', start:-3769, end:-2864, color:'#a0703a', region:6, tier:3, desc:'Hijo de Set. Vivió 905 años. "Entonces se comenzó a invocar el nombre del Señor".' },
  { id:'cainan', name:'Cainán', start:-3679, end:-2769, color:'#8a6d3b', region:6, tier:3, desc:'Hijo de Enós. Vivió 910 años.' },
  { id:'mahalaleel', name:'Mahalaleel', start:-3609, end:-2714, color:'#9b7b4a', region:6, tier:3, desc:'Hijo de Cainán. Vivió 895 años.' },
  { id:'jared', name:'Jared', start:-3544, end:-2582, color:'#7a5c3a', region:6, tier:3, desc:'Hijo de Mahalaleel. Vivió 962 años.' },
  { id:'enoch', name:'Enoc', start:-3382, end:-3017, color:'#b8860b', region:6, tier:2, desc:'"Caminó con Dios y desapareció, porque Dios se lo llevó". No murió; fue trasladado a los 365 años.' },
  { id:'methuselah', name:'Matusalén', start:-3317, end:-2348, color:'#8c6239', region:6, tier:3, desc:'El hombre más longevo: 969 años. Murió el año del Diluvio.' },
  { id:'lamech', name:'Lamec', start:-3130, end:-2353, color:'#9e7c4c', region:6, tier:3, desc:'Padre de Noé. Vivió 777 años.' },
  { id:'noah', name:'Noé', start:-2948, end:-1998, color:'#b5651d', region:6, tier:2, desc:'Construyó el arca y sobrevivió al Diluvio con su familia. Vivió 950 años.' },
  { id:'shem', name:'Sem', start:-2446, end:-1846, color:'#a67c52', region:6, tier:3, desc:'Hijo de Noé, antepasado de los pueblos semitas. Vivió 600 años.' },
  { id:'arphaxad', name:'Arfaxad', start:-2346, end:-1908, color:'#8a6d3b', region:6, tier:3, desc:'Hijo de Sem, nacido dos años después del Diluvio. Vivió 438 años.' },
  { id:'eber', name:'Éber', start:-2281, end:-1817, color:'#96652f', region:6, tier:3, desc:'Bisnieto de Sem; de su nombre derivaría "hebreo". Vivió 464 años.' },
  { id:'peleg', name:'Péleg', start:-2247, end:-2008, color:'#7a5c3a', region:6, tier:3, desc:'"En sus días fue repartida la tierra". Vivió 239 años.' },
  { id:'terah', name:'Taré', start:-2126, end:-1921, color:'#8c6239', region:6, tier:3, desc:'Padre de Abraham. Salió de Ur de los caldeos hacia Harán. Vivió 205 años.' },
  { id:'abraham', name:'Abraham', start:-1996, end:-1821, color:'#daa520', region:6, tier:1, desc:'Padre de las naciones. Dejó Ur por la promesa divina. Patriarca de judíos, cristianos y musulmanes. Vivió 175 años.' },
  { id:'isaac', name:'Isaac', start:-1896, end:-1716, color:'#a0703a', region:6, tier:3, desc:'Hijo de la promesa de Abraham y Sara. Vivió 180 años.' },
  { id:'jacob', name:'Jacob / Israel', start:-1837, end:-1690, color:'#9b6b3c', region:6, tier:2, desc:'Renombrado Israel; padre de las doce tribus. Descendió a Egipto. Vivió 147 años.' },

  // MEDIO ORIENTE (region 0)
  { id:'sumer', name:'Sumeria', start:-3500, end:-2000, color:'#c2955a', region:0, tier:2, desc:'Primera civilización conocida. Escritura cuneiforme, la rueda, el sistema sexagesimal. Ciudades-estado como Ur, Uruk y Lagash.' },
  { id:'egypt', name:'Egipto', start:-3100, end:-30, color:'#d4a843', region:0, tier:1, desc:'Una de las civilizaciones más longevas. Pirámides, momificación, jeroglíficos. Faraones como Ramsés II, Tutankamón y Cleopatra.' },
  { id:'akkad', name:'Acad', start:-2334, end:-2154, color:'#a67c52', region:0, tier:3, parent:'sumer', desc:'Primer imperio conocido, fundado por Sargón de Acad. Unificó las ciudades-estado sumerias.' },
  { id:'babylon', name:'Babilonia', start:-1894, end:-539, color:'#8b6914', region:0, tier:2, desc:'Centro cultural del mundo antiguo. Código de Hammurabi, Jardines Colgantes. Nabucodonosor II.' },
  { id:'assyria', name:'Asiria', start:-2500, end:-609, color:'#7a5c3a', region:0, tier:2, desc:'Imperio militar formidable. Capitales en Nínive y Asur. Biblioteca de Asurbanipal.' },
  { id:'hittites', name:'Hititas', start:-1600, end:-1178, color:'#9e8c6c', region:0, tier:3, desc:'Pueblo indoeuropeo en Anatolia. Pioneros del hierro. Batalla de Kadesh contra Egipto.' },
  { id:'phoenicia', name:'Fenicia', start:-1500, end:-300, color:'#4a90a4', region:0, tier:2, desc:'Maestros navegantes. Inventaron el primer alfabeto. Fundaron Cartago. Púrpura de Tiro.' },
  { id:'israel', name:'Israel / Judá', start:-1200, end:-586, color:'#3a6b8c', region:0, tier:2, desc:'Reinos hebreos. Saúl, David y Salomón. Primer Templo en Jerusalén.' },
  { id:'persia', name:'Persia / Aqueménida', start:-550, end:-330, color:'#b5651d', region:0, tier:1, desc:'Mayor imperio del mundo antiguo bajo Ciro y Darío. Satrapías, Camino Real. Guerras Médicas.' },
  { id:'parthia', name:'Partia', start:-247, end:224, color:'#8c6239', region:0, tier:2, desc:'Imperio iranio que rivalizó con Roma. Caballería y arqueros montados. Capital en Ctesifonte.' },
  { id:'sassanid', name:'Sasánida', start:224, end:651, color:'#9b6b3c', region:0, tier:2, parent:'parthia', desc:'Último gran imperio persa preislámico. Zoroastrismo. Rivales de Bizancio.' },
  { id:'caliphate', name:'Califato Islámico', start:632, end:1258, color:'#2e8b57', region:0, tier:1, desc:'Omeyas y Abasíes. Edad de Oro del Islam: álgebra, medicina, astronomía. Bagdad como centro cultural.' },
  { id:'ottoman', name:'Imperio Otomano', start:1299, end:1922, color:'#8b0000', region:0, tier:1, desc:'Uno de los imperios más longevos. Conquista de Constantinopla (1453). Solimán el Magnífico.' },

  // MEDITERRÁNEO / EUROPA (region 1)
  { id:'minoan', name:'Minoica', start:-2700, end:-1450, color:'#6495ed', region:1, tier:3, desc:'Civilización cretense. Palacio de Cnosos, Lineal A. Origen del mito del Minotauro.' },
  { id:'mycenae', name:'Micénica', start:-1600, end:-1100, color:'#4169e1', region:1, tier:3, parent:'minoan', desc:'Griegos de la Edad del Bronce. Guerra de Troya. Máscara de Agamenón. Lineal B.' },
  { id:'greece', name:'Grecia', start:-800, end:-146, color:'#1e90ff', region:1, tier:1, desc:'Cuna de la democracia, filosofía y teatro. Atenas, Esparta, Alejandro. Sócrates, Platón, Aristóteles.' },
  { id:'rome', name:'Roma', start:-753, end:476, color:'#dc143c', region:1, tier:1, desc:'De ciudad-estado a imperio mundial. Julio César, Augusto. Derecho romano, acueductos, coliseo.' },
  { id:'byzantine', name:'Bizancio', start:330, end:1453, color:'#9932cc', region:1, tier:1, parent:'rome', desc:'Imperio Romano de Oriente. Constantinopla. Justiniano I, Santa Sofía. Preservó la cultura clásica.' },
  { id:'frankish', name:'Francos / Francia', start:481, end:2026, color:'#4682b4', region:1, tier:1, desc:'De Clodoveo a Carlomagno, de la Revolución a la República. Catedrales góticas, Ilustración.' },
  { id:'hre', name:'Sacro Imperio Romano', start:800, end:1806, color:'#b8860b', region:1, tier:2, desc:'Sucesión del imperio carolingio. "Ni santo, ni romano, ni imperio". Centro de Europa central.' },
  { id:'england', name:'Inglaterra / G.B.', start:927, end:2026, color:'#e63946', region:1, tier:1, desc:'De Alfredo el Grande al Imperio Británico. Magna Carta, Shakespeare, Revolución Industrial.' },
  { id:'spain', name:'España', start:1479, end:2026, color:'#ff8c00', region:1, tier:1, desc:'Unión de Castilla y Aragón. Conquista de América, Siglo de Oro. Cervantes, Velázquez, Goya.' },
  { id:'russia', name:'Rusia', start:862, end:2026, color:'#556b2f', region:1, tier:1, desc:'De los varegos a los zares. Iván el Terrible, Pedro y Catalina la Grande. Hasta el Pacífico.' },
  { id:'portugal', name:'Portugal', start:1139, end:2026, color:'#228b22', region:1, tier:2, desc:'Pioneros de la exploración marítima. Vasco da Gama, Brasil, imperio en África y Asia.' },
  { id:'viking', name:'Vikingos / Nórdicos', start:793, end:1100, color:'#708090', region:1, tier:2, desc:'Navegantes y guerreros escandinavos. Islandia, Groenlandia y Vinland. Sagas y mitología.' },

  // ASIA (region 2)
  { id:'indus', name:'Valle del Indo', start:-3300, end:-1300, color:'#cd853f', region:2, tier:2, desc:'Harappa y Mohenjo-Daro. Urbanismo avanzado, drenajes, escritura no descifrada.' },
  { id:'china_ancient', name:'China (Dinastías)', start:-2070, end:1912, color:'#b22222', region:2, tier:1, desc:'Xia a Qing. Gran Muralla, pólvora, papel, brújula, imprenta. Confucio, Lao-Tse.' },
  { id:'india', name:'India', start:-600, end:2026, color:'#ff6347', region:2, tier:1, desc:'Maurya, Gupta, Mogol. Budismo, hinduismo. El cero, sistema decimal, Taj Mahal, especias.' },
  { id:'japan', name:'Japón', start:-660, end:2026, color:'#ff69b4', region:2, tier:1, desc:'De Jōmon a Meiji. Samuráis, shogunes, ukiyo-e. Aislamiento (sakoku) y modernización.' },
  { id:'mongol', name:'Imperio Mongol', start:1206, end:1368, color:'#8b4513', region:2, tier:1, desc:'Gengis Kan: el mayor imperio terrestre contiguo. Ruta de la Seda, Pax Mongolica.' },
  { id:'korea', name:'Corea', start:-57, end:2026, color:'#da70d6', region:2, tier:2, desc:'Tres Reinos, Goryeo, Joseon. Imprenta de tipos móviles de metal, hangul.' },

  // ÁFRICA (region 3)
  { id:'carthage', name:'Cartago', start:-814, end:-146, color:'#c0392b', region:3, tier:2, parent:'phoenicia', desc:'Potencia comercial fenicia del norte de África. Aníbal y los elefantes. Guerras Púnicas.' },
  { id:'ethiopia', name:'Etiopía / Aksum', start:-400, end:940, color:'#27ae60', region:3, tier:2, desc:'Reino de Aksum. Obeliscos monumentales. Uno de los primeros reinos cristianos.' },
  { id:'ghana', name:'Ghana / Mali / Songhai', start:300, end:1591, color:'#f39c12', region:3, tier:2, desc:'Imperios del África Occidental. Mansa Musa, Tombuctú como centro de aprendizaje.' },

  // AMÉRICAS (region 4)
  { id:'olmec', name:'Olmeca', start:-1500, end:-400, color:'#1abc9c', region:4, tier:2, desc:'Cultura madre de Mesoamérica. Cabezas colosales, juego de pelota, primer calendario.' },
  { id:'maya', name:'Maya', start:-2000, end:1500, color:'#16a085', region:4, tier:1, desc:'Escritura jeroglífica, calendario preciso, astronomía, pirámides, el concepto del cero.' },
  { id:'aztec', name:'Azteca / Mexica', start:1325, end:1521, color:'#e74c3c', region:4, tier:1, desc:'Tenochtitlán, de las mayores ciudades del mundo. Chinampas. Conquista por Cortés.' },
  { id:'inca', name:'Inca', start:1438, end:1533, color:'#e67e22', region:4, tier:1, desc:'Tahuantinsuyo: mayor imperio precolombino. Machu Picchu, quipus, 40.000 km de caminos.' },

  // NÓRDICO / OTROS (region 5)
  { id:'netherlands', name:'Países Bajos', start:1581, end:2026, color:'#f1c40f', region:5, tier:2, desc:'Siglo de Oro neerlandés. Compañía de las Indias Orientales, Rembrandt, Vermeer.' },
  { id:'prussia', name:'Prusia / Alemania', start:1525, end:2026, color:'#34495e', region:5, tier:1, desc:'De ducado a potencia. Federico el Grande, unificación bajo Bismarck (1871).' },
  { id:'usa', name:'Estados Unidos', start:1776, end:2026, color:'#2980b9', region:5, tier:1, desc:'Independencia, Constitución, Guerra Civil, expansión al oeste, potencia mundial.' },
  { id:'italy_unified', name:'Italia (Unificada)', start:1861, end:2026, color:'#16796f', region:5, tier:2, desc:'Risorgimento: unificación liderada por Garibaldi, Cavour y Víctor Manuel II.' },
];
