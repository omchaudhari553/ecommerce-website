import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  joinDate: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  searchTerm = '';
  selectedRole = 'all';
  roles = ['all', 'admin', 'user'];

  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    // Simulated data
    this.users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joinDate: '2024-01-15' },
      { id: 2, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', joinDate: '2024-01-01' },
      { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive', joinDate: '2024-02-15' }
    ];
  }

  get filteredUsers(): User[] {
    return this.users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.selectedRole === 'all' || user.role === this.selectedRole;
      return matchesSearch && matchesRole;
    });
  }

  toggleUserStatus(user: User): void {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    // TODO: Update status in backend
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      // TODO: Implement actual delete functionality
      this.users = this.users.filter(user => user.id !== id);
    }
  }
} 