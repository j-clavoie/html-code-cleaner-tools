ADDITION:
  - Afficher tous les Xe nombre dans 'Problems' tab pour vérifier s'ils doivent être coder ou non
    regex; 1ere version: (\d+\s*)*\d+[eè][r|re]*[\s\n]
    Fonctionne pour le test (seule la dernière ligne n'est pas considérée car il y a le mot effacer, voir si c'est pertinent):
      salut 357e
      lui 23e bonjour
      1er nombre
      1ere série
      1ère série
      salut 1 0001e 
      salut 1 000 00342 3 4 234 2 34 2 1effacer 


BUG:
  - L'extension flush le HEAD quand on est dans un code complet.
    L'extension retourne seulement le contenu du BODY.
    Trouver une solution pour conserver tout ce qui est autour du tag BODY
    Premier solution rapide: au lieu de remplacer tout le contenu de l'editeur, faire un "remplace" 
    de <body.*?> à </body> et y insérer le contenu du JSDOM comme je le fais déjà.

README:
  - Mettre à jour le readme pour l'option Clean URL
  