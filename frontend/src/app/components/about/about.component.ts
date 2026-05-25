import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  image: string;
  title: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  features: Feature[] = [
    {
      image: 'assets/img/features/f1.png',
      title: 'Free Shipping'
    },
    {
      image: 'assets/img/features/f2.png',
      title: 'Online Order'
    },
    {
      image: 'assets/img/features/f3.png',
      title: 'Save Money'
    },
    {
      image: 'assets/img/features/f4.png',
      title: 'Promotions'
    },
    {
      image: 'assets/img/features/f5.png',
      title: 'Happy Sell'
    },
    {
      image: 'assets/img/features/f6.png',
      title: '24/7 Support'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
