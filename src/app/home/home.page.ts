import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

// enum for face directions
export enum Faces {
  NORTH,
  EAST,
  SOUTH,
  WEST
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // table dimensions with index
  dimX = 5
  dimY = 5

  // table indices (make 0,0 at South West corner)
  dimIdxX = Array(this.dimX).fill(0).map((x, i) => x + i)
  dimIdxY = Array(this.dimY).fill(0).map((x, i) => x + i).reverse()

  // initial place locations
  placeDirection = -1
  xLoc = 0
  yLoc = 0

  // current state of robot
  currState = {
    x: -1,
    y: -1,
    f: Faces.NORTH
  }

  // image face direction
  degree = '0deg'

  isPlaced: boolean = false

  constructor(
    private toast: ToastController
  ) { }

  rotateRobot(direction) {
    if(!this.isPlaced) {
      this.showToast('Please place the robot first')
      return  
    }
    switch (direction) {
      case 'left':
        this.currState.f = this.currState.f == Faces.NORTH ? Faces.WEST : this.currState.f - 1
        this.setDirection(this.currState.f % 4)
        break;
      case 'right':
        this.currState.f = this.currState.f == Faces.WEST ? Faces.NORTH : this.currState.f + 1
        this.setDirection(this.currState.f % 4)
        break;
      default:
        console.log('Invalid direction')
        break;
    }
  }

  place() {
    if (this.xLoc == null || this.xLoc >= this.dimX) {
      this.showToast('Invalid X location')
      return
    }
    if (this.yLoc == null || this.yLoc >= this.dimY) {
      this.showToast('Invalid Y location')
      return
    }
    if (this.placeDirection == -1) {
      this.showToast('Please select direction')
      return
    }
    this.currState.x = this.xLoc
    this.currState.y = this.yLoc
    this.currState.f = this.placeDirection
    this.setDirection(this.currState.f)
    this.isPlaced = true
  }

  setDirection(dir) {
    switch (dir) {
      case Faces.NORTH:
        this.degree = '0deg'
        break;
      case Faces.EAST:
        this.degree = '90deg'
        break;
      case Faces.SOUTH:
        this.degree = '180deg'
        break;
      case Faces.WEST:
        this.degree = '-90deg'
        break;
    }
  }

  move() {
    if(!this.isPlaced) {
      this.showToast('Please place the robot first')
      return  
    }
    switch (this.currState.f) {
      case Faces.NORTH:
        this.currState.y = this.currState.y + 1 < this.dimY ? this.currState.y + 1 : this.currState.y
        break;
      case Faces.EAST:
        this.currState.x = this.currState.x + 1 < this.dimX ? this.currState.x + 1 : this.currState.x
        break;
      case Faces.SOUTH:
        this.currState.y = this.currState.y - 1 < 0 ? this.currState.y : this.currState.y - 1
        break;
      case Faces.WEST:
        this.currState.x = this.currState.x - 1 < 0 ? this.currState.x : this.currState.x - 1
        break;
    }
  }

  report() {
    if(!this.isPlaced) {
      this.showToast('Please place the robot first')
      return  
    }
    this.showToast('X: ' + this.currState.x + ', Y: ' + this.currState.y + ', Facing: ' + Faces[this.currState.f])
  }

  async showToast(msg) {
    const t = await this.toast.create({
      message: msg,
      duration: 3000
    })
    t.present()
  }

}
