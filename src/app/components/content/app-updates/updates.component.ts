import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MatBottomSheet } from '@angular/material';

import { ShareUpdateComponent } from './app-share-plugin/share.update.component';

import { GithubService } from '../../../services/github.service';
import { UpdatesJsonService } from '../../../services/updates.service';
import { NotificationService } from '../../../services/notification.service';
import { GoogleAnalyticsService } from '../../../services/google.analytics.service';

import { GithubFlat } from '../../../interfaces/github.interface';
import { Updates } from '../../../interfaces/updates.interface';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-features',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppUpdatesComponent implements OnInit {

  public commits: GithubFlat[];
  public updates$: Observable<Updates[]>;
  public fatalError = false;

  constructor(
    private updatesJsonService: UpdatesJsonService,
    private githubService: GithubService,
    private matBottomSheet: MatBottomSheet,
    private notificationService: NotificationService,
    private titleService: Title,
    private metaTagService: Meta,
    private googleAnalyticsService: GoogleAnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Runelite Plus: Updates');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'RuneLitePlus provides more functionality and less restrictions ' +
        'while staying open source. We have lots of RuneLite Plus plugins!'
    });
    this.metaTagService.updateTag({
      name: 'keywords',
      content: 'runelite, runeliteplus, runelite plus, runelite pvp plugins, runelite pvp, runelite plugins, updates, github updates'
    });

    this.updates$ = this.updatesJsonService.getJSON();

    this.githubService.getCommits().then(
      (commits) => {
        this.commits = commits;
        this.changeDetectorRef.detectChanges();
      }
    ).catch(
      () => this.fatalError = true
    );
  }

  public openBottomSheet(update: Updates): void {
    const sheet = this.matBottomSheet.open(ShareUpdateComponent, {
      data: { update },
    });

    sheet.afterDismissed().subscribe((data) => {
      if (typeof data !== 'undefined' && data.data === 'copy') {
        this.notificationService.showError('Update link copied to the clipboard!');
      } else {
        this.googleAnalyticsService.event('shareUpdateMenu', {
          event_category: 'closeShareMenu',
          event_label: 'Closing share menu',
          value: 1
        });
      }
    });
  }
}
