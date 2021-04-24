import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ServiceService} from "./service.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import { ToastrService } from "ngx-toastr";
import {IForm} from "./form.model";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  animations: [trigger('show', [
    transition(':enter', [
      style({opacity: 0}),
      animate('300ms ease', style({opacity: 1})),
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate('300ms ease', style({opacity: 0})),
    ])
  ])]
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild('scroll', {static: false}) scroll: ElementRef;
  destroy$ = new Subject();
  data: IForm[] = [];

  constructor(
    private service: ServiceService,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.data = res;
        this.data.forEach(el => {
          el.isReadOnly = true;
        });
      }, () => {
        this.toast.error('Непредвиденная ошибка');
      });
  }

  add() {
    const item = {
      id: 0,
      userId: 0,
      body: null,
      title: null,
      isReadOnly: false
    }
    this.data.push(item);
    setTimeout(() => {
      this.scroll.nativeElement.scrollTo(0, 35 * this.data.length);
    }, 1);
  }

  edit(item: IForm) {
    item.isReadOnly = false;
  }

  save(item: IForm) {
    this.service.editData(item.id, item)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          item.isReadOnly = true;
        }
      }, () => {
        this.toast.error('Непредвиденная ошибка');
      });
    item.isReadOnly = true;
  }

  delete(id:number) {
    this.service.deleteData(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.data.splice(this.data.findIndex(el => el.id === id), 1);
      }, () => {
        this.toast.error('Непредвиденная ошибка');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
