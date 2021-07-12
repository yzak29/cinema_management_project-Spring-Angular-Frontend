import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes: any;
  public cinemas: any;
  public salles: any;
  public currentVille: any;
  public currentCinema: any;
  public currentProjection: any;
  private selectedTickets: any;

  constructor(public cinemaService:CinemaService) {}

  ngOnInit(): void {
    this.cinemaService.getVille()
      .subscribe(data=>{
        this.villes = data;
      },error => {
        console.log(error);
      })

  }


  onGetCinemas(v: any) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>{
      this.cinemas = data;
    },error => {
      console.log(error);
    })

  }

  onGetSalles(c: any) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data=>{
      this.salles = data;
      this.salles._embedded.salles.forEach((salle: any)=>{
        this.cinemaService.getProjections(salle)
          .subscribe(data=>{
            salle.projections = data;
          },error => {
            console.log(error);
          })
      });
    },error => {
      console.log(error);
    })
  }

  onGetTicketPlace(p: any) {
    this.currentProjection = p;
    this.cinemaService.getTicketPlace(p)
      .subscribe(data=>{
        this.currentProjection.tickets = data;
        this.selectedTickets=[];
      },error => {
        console.log(error);
      })

  }

  onSelectTicket(t: any) {
    if (!t.selected){
      t.selected = true;
      this.selectedTickets.push(t);
    }else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t) , 1);
    }

    console.log(this.selectedTickets)

  }

  getTicketClass(t: any) {
    let str = "btn m-1 ";
    if (t.reservee){
      str += "btn-danger"
    }else if (t.selected){
      str += "btn-warning"
    }else {
      str += "btn-success"
    }
    return str;
  }


  onPayTicket(dataForm: any) {
    let tickets: any[] =[];
    this.selectedTickets.forEach((t:any)=>{
      tickets.push(t.id);
    });
    dataForm.tickets = tickets;
    console.log(dataForm)
    this.cinemaService.payerTicket(dataForm)
      .subscribe(data=>{
        alert("Ticket Réservés avec succés!");
        this.onGetTicketPlace(this.currentProjection);
      },error => {
        console.log(error);
      })
  }
}
