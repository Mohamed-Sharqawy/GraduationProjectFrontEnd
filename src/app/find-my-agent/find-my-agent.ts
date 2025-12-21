import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // مهم عشان نقدر نعرض الصور واللوب

@Component({
  selector: 'app-find-my-agent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './find-my-agent.html',
  styleUrl: './find-my-agent.css'
})
export class FindMyAgentComponent {
  isDropdownOpen = false;
  selectedPurpose: string = 'Purpose';

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectPurpose(purpose: string) {
    this.selectedPurpose = purpose;
    // Keep dropdown open or close it? User image shows "Done" button, so usually keep open until Done or clicking outside.
    // I'll keep it open as per UI pattern where there is a Done button.
  }

  resetPurpose() {
    this.selectedPurpose = 'Purpose';
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
  // دي بيانات وهمية شبه اللي بتيجي من الداتابيز
  agents = [
    {
      id: 1,
      name: 'Ahmed Mohamed',
      role: 'Senior Property Consultant',
      company: 'Deal Real Estate',
      experience: '5 Years',
      activeListings: 101,
      languages: ['Arabic', 'English'],
      image: 'https://randomuser.me/api/portraits/men/32.jpg', // صورة وهمية
      logo: 'https://ui-avatars.com/api/?name=Deal+Estate&background=000&color=fff', // لوجو وهمي
      badges: [
        { name: 'TruBroker™', type: 'tru', icon: '🏆' },
        { name: 'Quality Lister', type: 'quality', icon: '💎' },
        { name: 'Responsive Broker', type: 'responsive', icon: '⚡' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Hassan',
      role: 'Sales Manager',
      company: 'Emaar Misr',
      experience: '8 Years',
      activeListings: 45,
      languages: ['Arabic', 'English', 'French'],
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      logo: 'https://ui-avatars.com/api/?name=Emaar&background=0D47A1&color=fff',
      badges: [
        { name: 'Quality Lister', type: 'quality', icon: '💎' }
      ]
    },
    {
      id: 3,
      name: 'Omar Khaled',
      role: 'Real Estate Agent',
      company: 'Coldwell Banker',
      experience: '2 Years',
      activeListings: 12,
      languages: ['Arabic'],
      image: 'https://randomuser.me/api/portraits/men/85.jpg',
      logo: 'https://ui-avatars.com/api/?name=Coldwell&background=1565C0&color=fff',
      badges: [
        { name: 'Responsive Broker', type: 'responsive', icon: '⚡' }
      ]
    }
  ];
}