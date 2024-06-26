import { Component, OnInit, HostListener, Inject, ChangeDetectorRef } from '@angular/core';
import { Static } from '../models/static'; // Importing the Static model
import { HttpService } from '../service/http.service'; // Importing the HttpService
import { ActivatedRoute } from '@angular/router'; // Importing ActivatedRoute to access route parameters
import { PlayerDetailComponent } from '../player-detail/player-detail.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import {MatSliderModule} from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';

import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { StaticEventsService } from '../service/static-events.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environments';
import { Player } from '../models/player';

interface PlayerPGS {
  name: string;
  job: string;
  PGS: number;
}

@Component({
  selector: 'app-static-detail', // Component selector used in HTML
  templateUrl: './static-detail.component.html', // HTML template for the component
  styleUrls: ['./static-detail.component.css'], // Stylesheet for the component
})
export class StaticDetailComponent implements OnInit {
  public staticDetail: Static; // Holds the details of a static
  public uuid: string; // UUID of the static
  public gridColumns = 3; // Default number of grid columns
  public groupList = [];
  public test : boolean = true;
  public OriginalLockParam : any;
  public LockParamChangeCheck : boolean = false;
  public ShowAllPlayer : boolean = false;
  public SelectedPlayer : number;
  public ShowNumberLastWeekHistory : number = 4;
  public ShowAllHistory : boolean = false;
  public GearAcqHistory : Object = {};
  public HistoryGear : any = [];

  constructor(public http: HttpService, private route: ActivatedRoute, private _snackBar: MatSnackBar,
    private staticEventsService: StaticEventsService, private dialog : MatDialog, private cdr: ChangeDetectorRef
  ) {
    this.staticEventsService.recomputePGS$.subscribe(() => {
      this.groupList = this.ComputeNumberPGSGroup();
    });
   } // Constructor with dependency injection

  ngOnInit(): void {
    this.test = true;
    this.staticDetail = new Static(0, "", "", [], {});

    // Subscribe to route parameters to get the 'uuid'
    this.route.params.subscribe(params => {
      this.uuid = params['uuid'];
    });
    console.log("Trying details");
    // Fetch static details from the server using the uuid
    this.http.getStatic(this.uuid).subscribe(details => {
      console.log("Received details");
      this.staticDetail = details; // Assign the fetched details to staticDetail
      this.OriginalLockParam = JSON.parse(JSON.stringify(this.staticDetail.LockParam)); // Deepcopy
      console.log(this.staticDetail); // Log the static details to the console
      this.groupList = this.ComputeNumberPGSGroup();
      this.http.GetGearAcqHistory(this.uuid, this.ShowNumberLastWeekHistory).subscribe(data => {
        this.GearAcqHistory = data["info"];
        const keys = Object.keys(this.GearAcqHistory);

        for (let x = keys.length-1;x>=0;x--){
          this.HistoryGear.push(keys[x]);
        }

        this.cdr.detectChanges();
    });
    });
    this.onResize(null); // Call onResize to set initial gridColumns based on window size
  }

  c(){
    
  }

  ChangeHistoryLoaded(){
    this.http.GetGearAcqHistory(this.uuid, this.ShowNumberLastWeekHistory).subscribe(data => {
      // TODO : THIS UPADATE IS NOT VERY EFFICIENT
      this.GearAcqHistory = data["info"];
      this.HistoryGear = [];
      const keys = Object.keys(this.GearAcqHistory);

      for (let x = keys.length-1;x>=0;x--){
        this.HistoryGear.push(keys[x]);
      }

      this.cdr.detectChanges();
  });
  }

  CheckChange(){
    for (let key in this.OriginalLockParam){
      if (this.OriginalLockParam[key] !== this.staticDetail.LockParam[key]){
        this.LockParamChangeCheck=true;return;
      }
    }
    this.LockParamChangeCheck=false;
  }

  SaveLockParam(){
    this.http.updateStaticLockParam(this.staticDetail.uuid, this.staticDetail.LockParam).subscribe(res => {
      console.log(res);
      this.OriginalLockParam = JSON.parse(JSON.stringify(this.staticDetail.LockParam)); // Deepcopy
      this.LockParamChangeCheck=false;
      this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
        duration: 3500,
        data: {
          message: "Successfuly updated parameters.",
          subMessage: "",
          color : ""
        }
      });
    });
  }

  SaveStaticToUser(){
    if (localStorage.getItem('discord_access_token_xiv_loot') === null){
      this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
        duration: 3500,
        data: {
          message: "Login to save a static.",
          subMessage: "",
          color : ""
        }
      });
      return false;
    }
    this.http.getDiscorduserInfo(localStorage.getItem('discord_access_token_xiv_loot')!).subscribe(data => {
      this.http.SaveStaticToUser(data['id'], this.staticDetail.uuid).subscribe(res => {
        console.log(res);
        this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
          duration: 3500,
          data: {
            message: "Successfuly saved static!",
            subMessage: "",
            color : ""
          }
        });
      });
    });
  }

  onMouseEnter(event: any) {
    event.target.style.cursor = 'pointer';
    event.target.style.border = '3px solid rgba(255, 255, 255, 0.5)'
  }
  onMouseLeave(event: any) {
    event.target.style.border = '3px solid rgba(255, 255, 255, 0.2)'
  }

  selectPlayer(player : Player){
    console.log("Selected : " + player.name);
    this.SelectedPlayer = player.id;
  }

  getJobIcon(job : string){
    return `assets/job/${job}.png`;
  }

  getBackgroundColor(job : string){
    switch(job){
      case "BlackMage":
      case "RedMage":
      case "Summoner":
      case "Ninja":
      case "Samurai":
      case "Monk":
      case "Reaper":
      case "Dragoon":
      case "Bard":
      case "Machinist":
      case "Dancer":
      case "Viper":
      case "Pictomancer":        
        return "rgba(255, 0, 0, 0.25)";
      case "Astrologian":
      case "Sage":
      case "Scholar":
      case "WhiteMage":
        return "rgba(0,255,0,0.25)";
      case "DarkKnight":
      case "Paladin":
      case "Warrior":
      case "Gunbreaker":
        return "rgba(0, 0, 255, 0.25)";
    }
  }

  onChangeStaticName(event : Event){
    const selectElement = event.target as HTMLSelectElement;
    const newValue = selectElement.value;
    this.http.ChangeStaticName(this.staticDetail.uuid, newValue).subscribe(res => {
      console.log(res);
    });
  }

  @HostListener('window:resize', ['$event']) // Listen to window resize events
  onResize(event) {
    // Adjust gridColumns based on window width
    if (window.innerWidth < 600) {
      this.gridColumns = 1;
    } else if (window.innerWidth >= 600 && window.innerWidth < 768) {
      this.gridColumns = 2;
    } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
      this.gridColumns = 3;
    } else {
      this.gridColumns = 3;
    }
  }

  ComputeNumberPGSGroup(){

    let PGSList = [];
    let groupList = [];
    for (let i = 0;i<this.staticDetail.players.length;i++){
      PGSList.push(this.staticDetail.players[i]);
    }
    let highestPGS = Math.max(...PGSList.map(player => player.playerGearScore));
    let lowestPGS = Math.min(...PGSList.map(player => player.playerGearScore));

    let tol = (highestPGS - lowestPGS)/4;

    PGSList.sort((a, b) => a.playerGearScore - b.playerGearScore);
    let minPGS = PGSList[0].playerGearScore;
    let curMinPGSIndex = 0;
    let nGroup : number = 1;
    while (true){
      let index = PGSList.findIndex((a, b, c) => a.playerGearScore - minPGS > tol); // Find first outside of tolerance
      if (index == -1){
        groupList.push([curMinPGSIndex, PGSList.length-1]);
        break;
      }
      else {
        nGroup++;
        groupList.push([curMinPGSIndex, index-1]);
        curMinPGSIndex=index;
        minPGS = PGSList[index].playerGearScore;
      }
      if (nGroup == 4){
        groupList.push([curMinPGSIndex, PGSList.length-1]);
        break;
      }
    }
    nGroup = 0;
    let playerGroupList = [];

    for (let group of groupList){
      let curGroup = [];
      for (let i = group[0];i<=group[1];i+=1){
        curGroup.push(PGSList[i]);
        PGSList[i].PGSGroupNumber = nGroup;
      }
      playerGroupList.push({group : curGroup, nGroup : nGroup});
      nGroup+=1;
    }
    for(let i = playerGroupList.length;i<4;i++){
      playerGroupList.push({group : [], nGroup : 2*i}) // 2*i so there is no color and so it is empty
    }
    return playerGroupList;
  }

  GetGroupOfPlayer(player : Player){
    let playerGroupList = this.ComputeNumberPGSGroup();
    for (let group of playerGroupList){
      if (group.group.includes(player)){
        return group.nGroup;
      }
    }
  }

  GetGroupColor(nGroup : number){
    switch(nGroup){
      case 0:
        return 'rgba(255, 247, 0, 0.3)';
      case 1:
        return 'rgba(200, 0, 255, 0.3)';
      case 2:
        return 'rgba(0, 21, 255, 0.3)';
      case 3:
        return 'rgba(38, 255, 0, 0.3)';
    }
  }

  GetGroupBorderColor(nGroup : number){
    var baseStyle = "5px solid ";
    switch(nGroup){
      case 0:
        return baseStyle + 'rgba(255, 247, 0, 0.6)';
      case 1:
        return baseStyle + 'rgba(200, 0, 255, 0.6)';
      case 2:
        return baseStyle + 'rgba(0, 21, 255, 0.6)';
      case 3:
        return baseStyle + 'rgba(38, 255, 0, 0.5)';
    }
  }

  copyToClipboard(): void {
    const valueToCopy = environment.site_url+this.staticDetail.uuid;
    navigator.clipboard.writeText(valueToCopy)
      .then(() => {
        // Handle successful copying here, e.g., show a message
        console.log('UUID copied to clipboard!');
        this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
          duration: 3500,
          data : {
            message : "Copied to clipboard!", 
            subMessage : "(Send the link to your friends for them to access the static)",
            color : ""
          }
        });
      })
      .catch(err => {
        // Handle errors here
        console.error('Failed to copy UUID: ', err);
      });
  }


  openSettingPGS(){
    this.dialog.open(SettingPGS, {
      width: '500px',
      height: '500px',
      data: {uuid : this.staticDetail.uuid}
    }).afterClosed().subscribe(result => {
      console.log("after closed")
      console.log(result)
    });
  }

}

@Component({
  selector: 'SnackBar',
  template: `
   <div [style.background-color]="data.color" style="width: 100%; height: 100%; border-radius:10px;padding:10px; position: relative;">
      <h2>{{ data.message }}</h2>
      <p>{{ data.subMessage }}</p>
      <button mat-button matSnackBarAction (click)="snackBarRef.dismissWithAction()" style="position: absolute; top: 10px; right: 10px;">
      <mat-icon>close</mat-icon>
    </button>
    </div>

  `,
  imports: [MatIconModule],
  standalone:true,
  styles: [`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%; 
  }
  h2 {
    color: black;
    margin-bottom: 10px; 
    text-align: center;
  }
  p {
    text-align: center; 
  }
`]
})
export class PizzaPartyAnnotatedComponent {
  constructor(public snackBarRef: MatSnackBarRef<PizzaPartyAnnotatedComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
  ) {}
}



@Component({
  selector: 'setting-PGS',
  templateUrl: './setting-PGS.component.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatSliderModule,
    MatCardModule, FormsModule
  ]
})
export class SettingPGS {
  constructor(public dialogRef: MatDialogRef<SettingPGS>,public http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: { uuid : string },
    private sanitizer: DomSanitizer, private _snackBar: MatSnackBar
  ) {}
  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value_a : number = 0;
  value_b : number = 0;
  value_c : number = 0;


  ngOnInit(){
    this.http.GetPGSParam(this.data.uuid).subscribe(data => {
      this.value_a = Math.floor(data[0] * 10);
      this.value_b = Math.floor(data[1] * 10);
      this.value_c = Math.floor(data[2] * 10);
    });
  }

  SaveChange(){
    this.http.SetPGSParam(this.data.uuid, this.value_a/10, this.value_b/10, this.value_c/10).subscribe(data => {
      console.log(data);
      this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
        duration: 3500,
        data : {
          message : "Updated PGS settings", 
          subMessage : "(Reload the page to see the changes)",
          color : ""
        }
      });
      this.dialogRef.close()});
  }

}

