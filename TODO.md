END:
  - Convertir les balises A href avec le protocol FILE
    Remplacer les \ par des / et les espaces par des %20.
    Doit être effectué au début avant les autres modifications afin d'éviter entre autre la conversion des dash en ndash
    Il faut utiliser le DOM pour récupérer l'adresse sinon c'est des REGEX trop compliqués
    Résultat finla à obtenir: 
        file://adresse%20du%20fichier/au%20complet/suivi%20du%20nom%20du%20fichier.doc
 
 
    

GENERAL:
  Supprimer les espaces vides - en faire une fonction pour l'utiliser au début et à la fin
     - Supprimer les espaces vides avant:
            </a>
            </li>
            </abbr>
            </td>
      - Supprimer les espaces vides après:
            <a>
            <p>
            <li>
            <td>
            <div>
      - Supprimer les espaces dans les URL


TEXTE FORMAT:
  Convertir:
    - <b> par <strong>
    - <i> par <em>
    - 
