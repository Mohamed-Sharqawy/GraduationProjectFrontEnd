import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../Services/Agent-Service/agent.service';
import { AgentProfileDto } from '../../Models/Agent/agent-profile.dto';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './agent-profile.html',
  styleUrl: './agent-profile.css',
})
export class AgentProfile implements OnInit {
  agentId: string | null = null;
  agent: AgentProfileDto | null = null;
  isLoading: boolean = true;
  filteredProperties: any[] = [];
  locationSearch: string = '';

  constructor(
    private route: ActivatedRoute,
    private agentsService: AgentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.agentId = this.route.snapshot.paramMap.get('id');
    if (this.agentId) {
      // Clean the ID if it starts with a colon (common routing error)
      if (this.agentId.startsWith(':')) {
        this.agentId = this.agentId.substring(1);
      }
      this.getAgentData(this.agentId);
    }
  }

  getAgentData(id: string) {
    this.isLoading = true;
    this.agentsService.getAgentProfile(id).subscribe({
      next: (data) => {
        this.agent = data;
        this.filteredProperties = data.properties || [];
        this.isLoading = false;
        console.log('Agent Data:', this.agent);
        this.cdr.detectChanges(); // Force change detection
      },
      error: (err) => {
        console.error('Error fetching agent data:', err);
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  filterProperties() {
    if (!this.agent || !this.agent.properties) return;

    if (!this.locationSearch) {
      this.filteredProperties = this.agent.properties;
    } else {
      const search = this.locationSearch.toLowerCase();
      this.filteredProperties = this.agent.properties.filter(prop =>
        (prop.location && prop.location.toLowerCase().includes(search)) ||
        (prop.city && prop.city.toLowerCase().includes(search))
      );
    }
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
