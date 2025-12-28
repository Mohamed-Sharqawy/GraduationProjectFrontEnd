import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../Services/Agent-Service/agent.service';
import { Agent } from '../../Models/Agents/Agents';
import { AgentFilterDto } from '../../Models/Agents/agent-filter.dto';

@Component({
  selector: 'app-find-my-agent',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './find-my-agent.html',
  styleUrl: './find-my-agent.css'
})
export class FindMyAgentComponent implements OnInit {

  isDropdownOpen = false;
  selectedPurpose: string = 'Purpose';

  agents: Agent[] = [];
  totalCount: number = 0;

  // Filter Object
  filter: AgentFilterDto = {
    pageNumber: 1,
    pageSize: 10,
    sortDescending: true,
    sortBy: 'activePropertiesCount'
  };

  constructor(
    private agentsService: AgentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents() {
    this.agentsService.getAllAgents(this.filter).subscribe({
      next: (response) => {
        this.agents = response.items;
        this.totalCount = response.totalCount;
        console.log('Agents Loaded:', this.agents);
        this.cdr.detectChanges(); // Force change detection
      },
      error: (err) => {
        console.error('Error loading agents:', err);
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  search() {
    this.filter.pageNumber = 1; // Reset to first page on new search
    this.loadAgents();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectPurpose(purpose: string) {
    this.selectedPurpose = purpose;
    if (purpose === 'Buy') this.filter.purpose = 1;
    else if (purpose === 'Rent') this.filter.purpose = 2;
    else this.filter.purpose = undefined;

    // Optional: Auto search on selection? Or wait for button?
    // Let's wait for button to be consistent with other inputs
    this.isDropdownOpen = false;
  }

  resetPurpose() {
    this.selectedPurpose = 'Purpose';
    this.filter.purpose = undefined;
    this.isDropdownOpen = false;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
}