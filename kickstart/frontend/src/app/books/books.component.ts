import { Component, OnInit } from '@angular/core';
import { BookServiceService } from '../Service/book-service.service'
import { Observable, of } from 'rxjs';
import { Books } from '@app/Model/books';


import { routerTransition } from '@app/core';

@Component({
  selector: 'anms-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  books = ['Economics', 'History', 'Geology'];
  checkedList: any;

  constructor(private booksvc: BookServiceService) { }

  ngOnInit() {
    this.booksvc.getbooks().subscribe((data: Books) => {
      this.books.push(data.Books);
    })
  }

  public Addbooks(option, event) {
    if (event.target.checked) {
      this.checkedList.push(option.id);
    } else {
      for (var i = 0; i < this.books.length; i++) {
        if (this.checkedList[i] == option.id) {
          this.checkedList.splice(i, 1);
        }
      }
    }
    this.booksvc.insertbooks(this.checkedList);
  }
}
