import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgentsService } from '../../Services/AgentServices/AgentsService'; // اتأكد من المسار
import { Agent } from '../../Models/Agents/Agents'; // اتأكد من المسار

@Component({
  selector: 'app-find-my-agent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './find-my-agent.html',
  styleUrl: './find-my-agent.css'
})
// 1. زودنا implements OnInit عشان ننفذ كود أول ما الصفحة تفتح
export class FindMyAgentComponent implements OnInit {
  
  // متغيرات الـ UI زي ما هي (ماجتش جنبها)
  isDropdownOpen = false;
  selectedPurpose: string = 'Purpose';

  // 2. ده المتغير الجديد اللي هيشيل الداتا الحقيقية
  agents: Agent[] = []; 
  
  // متغيرات الـ Pagination
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;

  // 3. بنحقن السيرفيس هنا
  constructor(private agentsService: AgentsService) {}

  // 4. أول ما الصفحة تحمل، هات الداتا
  ngOnInit(): void {
    this.loadAgents();
  }

  // 5. الدالة المسؤولة عن الاتصال بالسيرفيس
  loadAgents() {
    this.agentsService.getAllAgents(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.agents = response.items;
        this.totalCount = response.totalCount;
        console.log('Agents Loaded:', this.agents);
      },
      error: (err) => {
        console.error('Error loading agents:', err);
      }
    });
  }

  // دوال الـ Dropdown زي ما هي
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectPurpose(purpose: string) {
    this.selectedPurpose = purpose;
  }

  resetPurpose() {
    this.selectedPurpose = 'Purpose';
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
}