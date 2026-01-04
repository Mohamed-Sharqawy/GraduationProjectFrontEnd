import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../Services/Agent-Service/agent.service';
import { Agent } from '../../Models/Agents/Agents';
import { AgentFilterDto } from '../../Models/Agents/agent-filter.dto';
import { TranslateModule } from '@ngx-translate/core';
import { encodeAgentId } from '../../utils/agent-id.utils';

@Component({
  selector: 'app-find-my-agent',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
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

  // Call Modal State
  isCallModalOpen = false;
  selectedAgentPhone: string = '';
  selectedAgentName: string = '';
  isCopied = false;

  openCallModal(agent: Agent) {
    if (!agent.phone) return;
    this.selectedAgentPhone = agent.phone;
    this.selectedAgentName = agent.fullName;
    this.isCallModalOpen = true;
    this.isCopied = false;
  }

  closeCallModal() {
    this.isCallModalOpen = false;
    this.selectedAgentPhone = '';
    this.selectedAgentName = '';
  }

  copyPhone() {
    navigator.clipboard.writeText(this.selectedAgentPhone).then(() => {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    });
  }

  // Encode agent ID for URL
  encodeAgentId(id: string): string {
    return encodeAgentId(id);
  }
}