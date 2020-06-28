import { Project } from './../../../Models/project';
import { Component, OnInit } from '@angular/core';
import { ProjectApiService } from 'src/app/Services/project-api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-project',
  templateUrl: './show-project.component.html',
  styleUrls: ['./show-project.component.scss']
})
export class ShowProjectComponent implements OnInit {
  id: string;
  project: Project;

  constructor(
    private projectApiService: ProjectApiService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.projectApiService.findProject(this.id).subscribe((project: Project) => {
      this.project = project;
    });
  }

  delete(id: any) {
    Swal.fire({
      title: 'Etes-vous sûre de vouloir supprimer ce project ?',
      text: 'Cet action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Supprimer'
    }).then((result) => {
      if (result.value) {
        this.projectApiService.deleteProduct(id).subscribe(() => {
          Swal.fire(
            'C\'est supprimé!',
            'Le projet a été supprimé avec succès',
            'success'
          );
          this.activeModal.close();
        });
      }
    });
  }

}
