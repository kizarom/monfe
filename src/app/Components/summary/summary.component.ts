import { Component, OnInit, OnDestroy } from '@angular/core';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Router } from '@angular/router';
import { Projet } from 'src/app/Models/projet';
import { ProjectApiService } from 'src/app/Services/project-api.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private projectApiServise: ProjectApiService) { }
  document;
  doc;
  project:Projet={
    title:"",
    client:"",
    adress:"",
    city:"",
    postalcode:"",
    price: 0
  };
  areas = [];
  configurators = [];
  components = [];
  ngOnInit(): void {
    var dataExist = false; 
    if(sessionStorage.getItem("projet")){
      this.project = JSON.parse(sessionStorage.getItem("projet"));
      dataExist = true;
    }

    if(sessionStorage.getItem("areas")){
      this.areas = JSON.parse(sessionStorage.getItem("areas"));
      dataExist = true;
    }

    if(sessionStorage.getItem("configurators")){
      this.configurators = JSON.parse(sessionStorage.getItem("configurators"));
      dataExist = true;
    }
    
    if(sessionStorage.getItem("composants")){
      this.components = JSON.parse(sessionStorage.getItem("composants"));
      dataExist = true;
    }
    if(!dataExist){
      this.router.navigateByUrl("/create/project/info"); 
    }
    this.generatePDF();
  }

  savePDF(){
    this.doc.save((this.project.title+"_DevisNo"+sessionStorage.getItem('idQuote')).trim()+".pdf");
  }

  printPDF(){
    this.doc.autoPrint();
    window.open(this.doc.output('bloburl'), '_blank');
  }

  generatePDF():void {
    this.doc = new jsPDF('p','pt', 'a4');
    this.doc.setFontSize(12);
    var image = new Image();
    image.src = 'assets/mondevis.png';
    this.doc.addImage(image,'png', 420, 8, 140, 30)
    this.doc.setFontStyle("normal");
    this.doc.text(["MonDevis","Adresse MonDevis, CP. 40000", "Marrakech"], 20, 70);
    this.doc.text(["Client : " + this.project.client.first_name +' '+this.project.client.last_name, "E-mail : "+this.project.client.email, "Adresse : " +this.project.adress+', CP '+this.project.postalcode, "Ville : "+this.project.city], 20, 130);
    this.doc.line(20, 185, 570, 185);
    this.doc.text(["N° Devis : "+sessionStorage.getItem('idQuote') ,"Date : "+(new Date).toLocaleDateString('fr-FR')], 20, 200);
    this.doc.line(20, 220, 570, 220);
    this.doc.text("Intitulé du projet : "+ this.project.title, 20, 250);
    let getQuoteData = ()=>{
      let data = [];
      this.areas.forEach((ar)=>{
        let config = this.configurators.find(cg => cg.areaTitle === ar.title);
        data.push([ar.title+" ("+(ar.width*ar.height).toFixed(2)+" m²)", config.kit.selected.kit_description, (config.kit.selected.price/1.2).toFixed(2), config.kit.selected.price])
      })
      return data;
    }
    let componentsTotalPrice = 0;
    let componentsCount = 0;
    this.components.forEach(comps=>{
      componentsCount += comps.product.length;
      comps.product.forEach(comp => {
        componentsTotalPrice += comp.price;
      });
    })
    this.doc.autoTable({
      startY: 280,
      theme: 'grid',
      headStyles: {fillColor:  [75, 75, 75], halign: 'center'},
      head: [[ "Surface de pose","Produit","Prix HT (DH)","Prix TTC (DH)"]],
      body: getQuoteData()
    })
    this.doc.autoTable({
      startY: this.doc.lastAutoTable.finalY + 20,
      theme: 'grid',
      headStyles: {fillColor:  [75, 75, 75], halign: 'center'},
      bodyStyles: {halign: 'center'},
      head: [[ "Nombre de composant", "Total prix HT (DH)","Totla prix TTC (DH)"]],
      body: [[componentsCount, (componentsTotalPrice/1.2).toFixed(2), componentsTotalPrice]]
    })

    this.doc.autoTable({
      startY: this.doc.lastAutoTable.finalY + 20,
      theme: 'grid',
      margin: { left: 400 },
      body: [
        ['Total HT', (this.project.price/1.2).toFixed(2)],
        ['Total TVA', (this.project.price-(this.project.price/1.2)).toFixed(2)],
        ['Total TTC', this.project.price + " DH"]
      ],
      didParseCell: function (data) {
        var rows = data.table.body;
        if (data.row.index === rows.length - 1) {
            data.cell.styles.fontStyle = "bold";
        }
    }
    })

    this.doc.text("Signature", 40, this.doc.lastAutoTable.finalY + 150);
    this.document = this.doc.output('arraybuffer');

    let quoteFile = new FormData();
    quoteFile.append('quote', this.doc.output('blob'));
    this.projectApiServise.setQuoteFile(quoteFile, sessionStorage.getItem('idQuote')).subscribe(response=>{
      //
    })
  }

  goBack(){    
    this.router.navigateByUrl("/projets"); 
  }

  ngOnDestroy(): void{
    sessionStorage.removeItem('projet');
    sessionStorage.removeItem('areas');
    sessionStorage.removeItem('areasData');
    sessionStorage.removeItem('needs');
    sessionStorage.removeItem('configurators');
    sessionStorage.removeItem('composants');
    sessionStorage.removeItem('idQuote');
    sessionStorage.removeItem('idProject');
    sessionStorage.removeItem('isUpdate');
  }


}
