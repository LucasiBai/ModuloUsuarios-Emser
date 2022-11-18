import { Component, Input } from '@angular/core';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-ask-for-delete',
  templateUrl: './ask-for-delete.component.html',
  styleUrls: ['./ask-for-delete.component.css'],
})
export class AskForDeleteComponent {
  @Input() title!: String;
  @Input() id!: Number;

  constructor(private itemList: ItemListComponent) {}

  public cancelDelete() {
    this.itemList.cancelDeleteAsk();
  }

  public acceptDelete() {
    this.itemList.deleteRow(this.id);
  }
}
