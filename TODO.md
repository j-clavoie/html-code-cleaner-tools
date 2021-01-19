BUG:
  - L'extension flush le HEAD quand on est dans un code complet.
    L'extension retourne seulement le contenu du BODY.
    Trouver une solution pour conserver tout ce qui est autour du tag BODY
    Premier solution rapide: au lieu de remplacer tout le contenu de l'editeur, faire un "remplace" 
    de <body.*?> à </body> et y insérer le contenu du JSDOM comme je le fais déjà.

README:
  - Mettre à jour le readme pour l'option Clean URL
  