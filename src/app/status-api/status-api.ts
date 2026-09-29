import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { StatusDaApi } from './status-da-api';

@Component({
  selector: 'app-status-api',
  templateUrl: './status-api.html',
  styleUrl: './status-api.css',
})
export class StatusApi {
  protected readonly health = httpResource<StatusDaApi>(() => '/api/health');
}
