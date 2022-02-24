import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteList } from './app-routing.module';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = environment.settings.appTitle;
  navLinks: any[];
  activeLinkIndex = -1;
  constructor(private router: Router) {
    let navLinkList: any[] = [];
    let iterator = 0;
    RouteList.forEach(function(route){
      if(route.path !== ''){
        navLinkList.push({
          label: route.data !== undefined && route.data['label'] !== undefined ? route.data['label'] : 
            route.path!.charAt(0).toUpperCase() + route.path!.slice(1),
            link: './' + route.path,
            index: iterator
        });
      }
      
      iterator++;
    });
    for(let i = 0; i < environment.settings.otherLinks.length; i++){
      let link: any =  environment.settings.otherLinks[i];
      let uri: string = link.uri!;
      let label: string = link.label!;
      navLinkList.push({
        label: label,
          link: uri,
          index: iterator
      });
    }
   
    this.navLinks = navLinkList;
  }
  ngOnInit(): void {
    this.router.events.subscribe((res) => {
        this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }
}