import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgentsService } from '../../Services/AgentServices/AgentsService';
import { AgentProfile as AgentProfileModel } from '../../Models/Agents/Agents';

@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agent-profile.html',
  styleUrl: './agent-profile.css',
})
export class AgentProfile implements OnInit {
  agentId: string | null = null;
  agent: AgentProfileModel | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private agentsService: AgentsService
  ) { }

  ngOnInit() {
    this.agentId = this.route.snapshot.paramMap.get('id');
    if (this.agentId) {
      this.getAgentData(this.agentId);
    }
  }

  getAgentData(id: string) {
    this.isLoading = true;
    this.agentsService.getAgentProfile(id).subscribe({
      next: (data) => {
        this.agent = data;
        this.isLoading = false;
        console.log('Agent Data:', this.agent);
      },
      error: (err) => {
        console.error('Error fetching agent data:', err);
        this.isLoading = false;
      }
    });
  }

  openEmail(email: string) {
    if (email) window.location.href = `mailto:${email}`;
  }

  openCall(phone: string) {
    if (phone) window.location.href = `tel:${phone}`;
  }

  openWhatsApp(number: string) {
    if (number) window.open(`https://wa.me/${number}`, '_blank');
  }
}
