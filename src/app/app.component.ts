import {
  Component, ViewChild, OnInit, ChangeDetectionStrategy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export enum SearchTypeEnum {
  byName = 'by Name',
  byWeight = 'by Weight',
  bySymbol = 'by Symbol'
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  title = 'testing-app';

  private buttonList: any = false;
  private inputList = [
  ];

  private disabled = false;
  private searchFilter:string = '';
  private isFilterActive:boolean = false;
  private myForm = new FormControl("childForm");

  private searchTypeEnum = SearchTypeEnum;
  private activeSearchType = SearchTypeEnum.byName;
  private searchTypeLabel: string;

  constructor() {}

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.myForm.disable();

    this.myForm.valueChanges.subscribe(v => {
      /* causes ExpressionChangedAfterItHasBeenCheckedError. Fix error keep code structure in places.   */
      this.disabled = true;

    });

    const getter = this.createExtractGetter();
    console.log(getter(this.testData));

    this.updateSearchLabel();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.isFilterActive = !!filterValue;
  }

  clearFilters() {
    this.dataSource.filter = '';
    this.searchFilter = '';
    this.isFilterActive = false;
  }

  updateSearchLabel() {
    this.searchTypeLabel = 'Search ' + this.activeSearchType;
  }

  switchSearchType(searchType) {
    if (searchType !== this.activeSearchType) {
      this.activeSearchType = searchType;
      this.updateSearchLabel();
    }
  }

  testData = {
    a:{
      a_a:"2019-01-01",
      a_b:88,
      a_c:{
        a_c_a:"value",
      }
    },
    b:"2019-02-01"
  }

  /* extract all dates from testData. ignore non date values */
  private createExtractGetter() {
    let result = [];
    return function extractDate(obj: any): Date[] {
      Object.keys(obj).forEach(name => {
        const currItem = obj[name];
        if (currItem instanceof Array) {
          currItem.forEach(item => {
            const newRes = extractDate(item);
            result = newRes;
          });
        } else if (currItem instanceof Object) {
            const newRes = extractDate(currItem);
            result = newRes;
        } else if (typeof currItem === 'string') {
          try {
            const addedDate: Date = new Date(currItem);
            if (addedDate.toLocaleString().toLowerCase().includes('invalid')) {
              return result;
            } else {
              return result.push(addedDate);
            }
          } catch (e) {
            return result;
          }
        }
      });
      return result;
    };
  }


}
