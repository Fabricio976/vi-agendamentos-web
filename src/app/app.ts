import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatusApi } from './status-api/status-api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StatusApi],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
