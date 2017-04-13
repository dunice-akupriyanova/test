import { TestBed, inject } from '@angular/core/testing';

import { NotificationWebsocketService } from './notification-websocket.service';

describe('NotificationWebsocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationWebsocketService]
    });
  });

  it('should ...', inject([NotificationWebsocketService], (service: NotificationWebsocketService) => {
    expect(service).toBeTruthy();
  }));
});
