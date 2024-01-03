import { Component, inject } from "@angular/core";
import { ConversationService } from "../../shared/data-access/conversation.service";
import { MessageBoxComponent } from "./ui/message-box.component";

@Component({
    standalone: true,
    selector: 'app-conversation',
    template: `
    <h1>{{ conversationService.currentConversation()?.name }}</h1>
    <ul>
      @for(member of conversationService.currentConversation()?.members; track $index) {
        <li>{{ member.username }}</li>
      }
    </ul>
    <app-message-box/>
    `,
    imports: [MessageBoxComponent]
})
export default class ConversationComponent {
    conversationService = inject(ConversationService);
}