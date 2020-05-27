import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatatableConfigurationService {

  constructor() { }

  language = {
    emptyTable:     "Aucune donnée disponible dans le tableau",
    info:           "Affichage de l'élément _START_ à _END_ sur _TOTAL_ éléments",
    infoEmpty:      "Affichage de l'élément 0 à 0 sur 0 élément",
    infoFiltered:   "(filtré à partir de _MAX_ éléments au total)",
    infoPostFix:    "",
    infoThousands:  ",",
    lengthMenu:     "Afficher _MENU_ éléments",
    loadingRecords: "Chargement...",
    processing:     "Traitement...",
    search:         "Rechercher :",
    zeroRecords:    "Aucun élément correspondant trouvé",
    paginate: {
        first:    "Premier",
        last:     "Dernier",
        next:     "Suivant",
        previous: "Précédent"
      },
      aria: {
          sortAscending:  ": activer pour trier la colonne par ordre croissant",
          sortDescending: ": activer pour trier la colonne par ordre décroissant"
      },
      select: {
              rows: {
                  _: "%d lignes sélectionnées",
                  0: "Aucune ligne sélectionnée",
                  1: "1 ligne sélectionnée"
              } 
      }
  };

  confiuration =  {
    pagingType: 'full_numbers',
    processing: true,
    language: this.language
  };

  getDatatableConfiguration(lengthMenu = [10, 30, 50]){
    let menu = lengthMenu.slice(0) as any[];
    lengthMenu.push(-1);
    menu.push('Tous');    
    this.confiuration['lengthMenu'] = [lengthMenu,menu];
    this.confiuration['pageLength'] = lengthMenu[0];
    return this.confiuration;
  }

}
