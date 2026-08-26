import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    CardModule,
    TagModule,
    TableModule,
    ProgressBarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  users: User[] = [
    {
      name: 'Shaad Bangi',
      email: 'shaad@example.com',
      role: 'Admin',
      status: 'Active'
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Member',
      status: 'Active'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Member',
      status: 'Disabled'
    }
  ];

}