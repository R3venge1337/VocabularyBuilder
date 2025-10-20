import { Component } from '@angular/core';
import { HomeCardComponent } from "../../components/home-card-component/home-card-component";

@Component({
  selector: 'app-home-page',
  imports: [HomeCardComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export default class HomePage {

}
