import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  private allBlogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'The Cotton-Jersey Zip-Up Hoodie',
      excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony, godard...',
      content: 'Full article content here...',
      image: 'assets/img/blog/b1.jpg',
      date: '13/01'
    },
    {
      id: 2,
      title: 'How to Style a Quiff',
      excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony, godard...',
      content: 'Full article content here...',
      image: 'assets/img/blog/b2.jpg',
      date: '14/01'
    },
    {
      id: 3,
      title: 'Must-Have Skater Girl Items',
      excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony, godard...',
      content: 'Full article content here...',
      image: 'assets/img/blog/b3.jpg',
      date: '15/01'
    },
    {
      id: 4,
      title: 'Runway-Inspired Trends',
      excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony, godard...',
      content: 'Full article content here...',
      image: 'assets/img/blog/b4.jpg',
      date: '16/01'
    },
    {
      id: 5,
      title: 'AW20 Menswear Trends',
      excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony, godard...',
      content: 'Full article content here...',
      image: 'assets/img/blog/b5.jpg',
      date: '17/01'
    }
  ];

  blogPosts: BlogPost[] = [];
  currentPage = 1;
  itemsPerPage = 3;
  totalPages = Math.ceil(this.allBlogPosts.length / this.itemsPerPage);
  pages = Array.from({length: this.totalPages}, (_, i) => i + 1);

  constructor() {}

  ngOnInit() {
    this.updateDisplayedPosts();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedPosts();
    }
  }

  private updateDisplayedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.blogPosts = [...this.allBlogPosts].slice(startIndex, endIndex);
  }
}
