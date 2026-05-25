import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
  joinDate: string;
  lastLogin: string;
  orders: number;
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;

  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    // Simulated data
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'Active',
        joinDate: '2024-01-15',
        lastLogin: '2024-03-20T10:30:00',
        orders: 12
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'User',
        status: 'Active',
        joinDate: '2024-02-01',
        lastLogin: '2024-03-19T15:45:00',
        orders: 5
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'User',
        status: 'Inactive',
        joinDate: '2024-02-15',
        lastLogin: '2024-03-10T09:20:00',
        orders: 3
      }
    ];
    this.filterUsers();
  }

  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddUserModal(): void {
    // TODO: Implement add user modal
    console.log('Opening add user modal');
  }

  editUser(user: User): void {
    // TODO: Implement edit user
    console.log('Editing user:', user);
  }

  viewUserDetails(user: User): void {
    // TODO: Implement view user details
    console.log('Viewing user details:', user);
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      // TODO: Implement actual delete functionality
      this.users = this.users.filter(u => u.id !== user.id);
      this.filterUsers();
    }
  }
} 