// Type number-number object
interface OppositeKeysType {
  [key: number]: number
}

class Snake {
  // Init class variables
  private yPos: number = 2 // Current position of snake's 'head' on the y axis
  private xPos: number = 0 // Current position of snake's 'head' on the x axis
  private snakePosition: number[][] = [
    [2, 0],
    [1, 0],
    [0, 0],
  ] // Position of each parts of snake
  private direction: number = 83 // Current direction of snake
  private directionChanged: boolean = false // Tracking direction changing
  private gameFieldSize: number // Width and height of the game field
  private intervalId: number = 0 // Id of setInterval
  private foodPosition: number[] = [0, 0]
  private foodEaten: boolean = false
  private currentScore: number = 0 // Current user score
  private bestScore: number = +(localStorage.getItem("score") ?? 0)

  // Key codes object
  private oppositeKeys: OppositeKeysType = {
    87: 83, // 83 - s (down direction)
    83: 87, // 87 - w (up direction)
    68: 65, // 65 - a (left direction)
    65: 68, // 68 - d (rigth direction)
  }

  // Page elements
  private cells: Element[][] // Cells of the game field
  private currentScoreElement: Element
  private bestScoreElement: Element

  constructor() {
    // Creating two-dimensional cells array
    this.cells = []
    const gameCells: Element[] = Array.from(document.querySelectorAll(".cell")!)
    this.gameFieldSize = Math.sqrt(gameCells.length)
    for (let i = 0; i < this.gameFieldSize; i++) {
      this.cells.push(gameCells.splice(0, this.gameFieldSize))
    }

    // Getting elements which shows user scores
    this.currentScoreElement = document.querySelector(".current-score")!
    this.bestScoreElement = document.querySelector(".record")!

    // Setting best user score
    this.bestScoreElement.innerHTML = this.bestScore.toString()

    // Creating food and snake on the game field
    this.createFood()
    this.paintSnake()

    // Creating interval
    this.intervalId = window.setInterval(() => {
      this.directionChanged = false
      this.eraseSnake()
      this.updatePosition()
      this.paintSnake()
    }, 150 /* snake speed */)

    // Creating event listener for document
    document.addEventListener("keydown", this.changeDirection)
  }

  private changeDirection = (e: KeyboardEvent): void => {
    if (
      [87, 83, 68, 65].includes(e.keyCode) &&
      this.direction !== this.oppositeKeys[e.keyCode] &&
      !this.directionChanged
    ) {
      this.direction = e.keyCode
    }
    this.directionChanged = true
  }

  // Snake logic functions
  private eraseSnake = (): void => {
    this.snakePosition.forEach((val) => {
      const [y, x]: number[] = val
      this.cells[y][x].classList.remove("snake")
    })
  }

  private paintSnake = (): void => {
    this.snakePosition.forEach((val) => {
      const [y, x]: number[] = val
      this.cells[y][x].classList.add("snake")
    })
  }

  private updatePosition = (): void => {
    if (this.direction === 83 && this.yPos + 1 < this.gameFieldSize) {
      this.yPos += 1
      if (!this.foodEaten) this.snakePosition.pop()
      this.snakePosition.unshift([this.yPos, this.xPos])
    } else if (this.direction === 87 && this.yPos - 1 >= 0) {
      this.yPos -= 1
      if (!this.foodEaten) this.snakePosition.pop()
      this.snakePosition.unshift([this.yPos, this.xPos])
    } else if (this.direction === 68 && this.xPos + 1 < this.gameFieldSize) {
      this.xPos += 1
      if (!this.foodEaten) this.snakePosition.pop()
      this.snakePosition.unshift([this.yPos, this.xPos])
    } else if (this.direction === 65 && this.xPos - 1 >= 0) {
      this.xPos -= 1
      if (!this.foodEaten) this.snakePosition.pop()
      this.snakePosition.unshift([this.yPos, this.xPos])
    } else {
      this.gameOver()
    }
    this.checkCollision()
    this.foodEaten = false
    this.checkFood()
  }

  private checkCollision = (): void => {
    this.snakePosition.forEach((val, i) => {
      if (i !== 0) {
        const [y, x]: number[] = val
        if (x === this.xPos && y === this.yPos) {
          this.gameOver()
        }
      }
    })
  }

  private checkRecord = () => {
    if (this.currentScore > this.bestScore) {
      this.bestScoreElement.innerHTML = this.currentScore.toString()
      localStorage.setItem("score", this.currentScore.toString())
    }
  }

  // Game logic functions
  private getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private createFood = (): void => {
    let c = true
    while (c) {
      c = false
      const yPosFood: number = this.getRandomNumber(0, this.gameFieldSize - 1)
      const xPosFood: number = this.getRandomNumber(0, this.gameFieldSize - 1)

      this.snakePosition.forEach((val) => {
        const [y, x] = val
        if (y === yPosFood && x === xPosFood) {
          c = true
        }
      })

      if (!c) {
        this.foodPosition = [yPosFood, xPosFood]
        this.cells[yPosFood][xPosFood].classList.add("food")
      }
    }
  }

  private checkFood = (): void => {
    if (this.snakePosition[0].join("") === this.foodPosition.join("")) {
      this.foodEaten = true
      this.clearFood()
      this.createFood()

      this.currentScore += 1
      this.currentScoreElement.innerHTML = this.currentScore.toString()
      this.checkRecord()
    }
  }

  private clearFood = (): void => {
    const [yPosFood, xPosFood] = this.foodPosition
    this.cells[yPosFood][xPosFood].classList.remove("food")
  }

  private startGame = (): void => {
    this.currentScore = 0
    this.currentScoreElement.innerHTML = this.currentScore.toString()
    this.yPos = 2
    this.xPos = 0
    this.snakePosition = [
      [2, 0],
      [1, 0],
      [0, 0],
    ]
    this.direction = 83
    this.createFood()
  }

  private gameOver = (): void => {
    console.log("Game is over!")
    this.clearFood()
    this.startGame()
  }

  public deinit = (): void => {
    this.eraseSnake()
    document.removeEventListener("keydown", this.changeDirection)
    clearInterval(this.intervalId)
    this.clearFood()
  }
}

const snake = new Snake()
