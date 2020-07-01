import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatableConfAlternativeService {

  constructor() { }

  language = {
    emptyTable: "Aucune donnée disponible dans le tableau",
    info: "",
    infoEmpty: "",
    infoFiltered: "(filtré à partir de _MAX_ éléments au total)",
    infoPostFix: "",
    infoThousands: ",",
    lengthMenu: "Afficher _MENU_ éléments",
    loadingRecords: "Chargement...",
    processing: "Traitement...",
    search: "",
    zeroRecords: "Aucun élément correspondant trouvé",
    paginate: {
      first: "Premier",
      last: "Dernier",
      next: "Suivant",
      previous: "Précédent"
    },
    aria: {
      sortAscending: ": activer pour trier la colonne par ordre croissant",
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

  configuration = {
    pagingType: 'full_numbers',
    processing: true,
    language: this.language,
    searching: false,
  };

  getDatatableConfiguration(lengthMenu = [10, 30, 50]) {
    let menu = lengthMenu.slice(0) as any[];
    lengthMenu.push(-1);
    menu.push('Tous');
    this.configuration['lengthMenu'] = [lengthMenu, menu];
    this.configuration['pageLength'] = lengthMenu[0];
    return this.configuration;
  }
}
