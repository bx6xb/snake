interface Dict {
  [value: string]: number
}

interface StringStringDict {
  [value: string]: string
}

class Snake {
  private y: number = 0
  private x: number = 0
  private direction: string = "s"
  private fields: any[]
  private size: number
  private overlay: HTMLElement
  private restartBtn: HTMLElement
  private intervalId: ReturnType<typeof setInterval> = setInterval(() => {},
  10000)
  private snakePosition: number[]
  private foodPosition: number[] = [0, 0]
  private scoreElement: HTMLElement
  private score: number = 0
  private recordElement: HTMLElement
  private record: number = +(localStorage.getItem("record") ?? 0)

  private directionIndexes: Dict = {
    w: -1,
    a: -1,
    s: 1,
    d: 1,
  }

  private oppositeDirections: StringStringDict = {
    w: "s",
    s: "w",
    a: "d",
    d: "a",
  }

  constructor() {
    this.fields = Array.from(document.querySelectorAll(".field")!)
    this.size = this.fields.length ** 0.5 - 1
    this.overlay = document.querySelector(".overlay")!
    this.restartBtn = document.querySelector("#restart-btn")!
    this.snakePosition = [0, 0]
    this.scoreElement = document.querySelector(".current-score")!
    this.recordElement = document.querySelector(".record")!

    for (let i = 0; i <= this.size; i++) {
      this.fields.unshift(this.fields.splice(i, this.size + 1))
    }
    this.fields.reverse()

    document.addEventListener("keypress", (e) => {
      if (
        e.key in this.oppositeDirections &&
        this.direction !== this.oppositeDirections[e.key]
      ) {
        this.changeDirection(e.key)
      }
    })

    this.start()
    this.createFood()
    this.recordElement.innerHTML = this.record.toString()
  }

  private createFood = (): void => {
    this.fields[this.foodPosition[0]][this.foodPosition[1]].innerHTML = ""
    this.foodPosition = [
      this.getRandomNumber(0, this.size),
      this.getRandomNumber(0, this.size),
    ]
    this.fields[this.foodPosition[0]][this.foodPosition[1]].innerHTML = "1"
  }

  private changeDirection = (direction: string): void => {
    this.direction = direction
  }

  private checkRecord = (): void => {
    if (this.score > this.record) {
      this.record = this.score
      this.recordElement.innerHTML = this.record.toString()
      localStorage.setItem("record", this.record.toString())
    }
  }

  private getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private start = (): void => {
    this.fields[this.y][this.x].classList.remove("selected")
    this.y = 7
    this.x = 2
    this.direction = "d"
    this.fields[this.y][this.x].classList.add("selected")

    this.intervalId = setInterval(() => {
      this.moveSnake(this.direction)
    }, 200)
  }

  private restart = (): void => {
    this.restartBtn.removeEventListener("click", this.restart)
    this.overlay.classList.remove("show")
    this.start()
  }

  private increaseScore = (): void => {
    this.score++
    this.scoreElement.innerHTML = this.score.toString()
  }

  private gameOver = (): void => {
    clearInterval(this.intervalId)
    this.overlay.classList.add("show")
    this.restartBtn.addEventListener("click", this.restart)
    this.score = 0
  }

  private moveSnake = (direction: string): void => {
    if (["w", "a", "s", "d"].includes(direction)) {
      this.fields[this.y][this.x].classList.remove("selected")
      if (["w", "s"].includes(direction)) {
        if (
          this.y + this.directionIndexes[direction] >= 0 &&
          this.y + this.directionIndexes[direction] <= this.size
        ) {
          this.y += this.directionIndexes[direction]
        } else {
          this.checkRecord()
          this.gameOver()
        }
      } else {
        if (
          this.x + this.directionIndexes[direction] >= 0 &&
          this.x + this.directionIndexes[direction] <= this.size
        ) {
          this.x += this.directionIndexes[direction]
        } else {
          this.checkRecord()
          this.gameOver()
        }
      }
      this.fields[this.y][this.x].classList.add("selected")

      if (this.foodPosition.join("") === [this.y, this.x].join("")) {
        this.increaseScore()
        this.createFood()
      }
    }
  }
}

const snake: Snake = new Snake()
