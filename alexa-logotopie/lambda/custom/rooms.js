module.exports = [
    { 
        name : "Debut",
        description :`
Vous êtes dans une pièce vide. Les murs sont immaculés excepté une inscription noire qui balaie le mur ouest. Une ouverture rectangulaire libère le passage dans le mur nord.
`,
        rule :` 
Règle : Les murs, le sol et le plafond sont disposés de telle sorte que l'espace intérieur qu'ils délimitent forme un parallelepipède rectangle à base carré de 4m de coté et d'une hauteur de 2m.
Ils sont uniformément peints en blanc. 
Un neon allumé d'une longeur d'1 mètre est vissé au centre du  plafond et orienté dans la direction sud-nord éclaire la pièce.
Un passage rectangulaire d'un mètre quatrevingt de hauteur sur un mètre perce le centre du mur nord juqu'au sol. 
Sur le mur ouest centré au milieu est écrit la présente règle en lettre romane noire de 10 cm
`         
    } ,
    {
        name : "Ouvrir en enlevant la fermeture",
        description : `
Vous êtes dans une pièce vide. Les murs sont immaculés excepté une inscription noire et rouge qui balaie le mur ouest. Une porte rectangulaire semble fermer un passage dans le mur nord.
`,
        rule :`
Règle : Les murs, le sol et le plafond sont disposés de telle sorte que l'espace intérieur qu'ils délimitent forme un parallelepipède rectangle à base carré de 4m de coté et d'une hauteur de 2m.
Ils sont uniformément peints en blanc. 
Un neon allumé d'une longeur d'1 mètre vissé au centre du  plafond et orienté dans la direction sud-nord éclaire la pièce.
Une porte {fermée} rectangulaire bloque un passage d'1 mètre 80 de hauteur sur 1 mètre de largeur au centre du mur nord. 
Sur le mur ouest centré au milieu est écrit la présente règle en lettre romane noire de 10 cm excepté le mot "fermée" est de couleur rouge
`
    }
];

