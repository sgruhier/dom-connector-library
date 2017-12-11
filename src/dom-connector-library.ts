interface IPosition {
  top: number
  left: number
}

export type AttachmentOptions =
  | "top-left"
  | "top-middle"
  | "top-right"
  | "middle-left"
  | "middle-middle"
  | "middle-right"
  | "bottom-left"
  | "bottom-middle"
  | "bottom-right"

export interface IOptions {
  from: AttachmentOptions
  to: AttachmentOptions
  className?: string
}

export class DOMConnectors {
  public static DebounceDelay = 1

  private static instance: DOMConnectors
  private connectors: DOMConnector[] = []

  // To protect from instantion, singleton pattern
  private constructor() {
    window.addEventListener(
      "resize",
      this.debounce(this.update.bind(this), DOMConnectors.DebounceDelay),
      false
    )
  }

  public static getInstance() {
    if (!DOMConnectors.instance) {
      DOMConnectors.instance = new DOMConnectors()
    }
    return DOMConnectors.instance
  }

  public add(connector: DOMConnector) {
    this.connectors.push(connector)
  }

  public update() {
    this.connectors.forEach((connector: DOMConnector) => connector.update())
  }

  // Adhock debounce method, don't care about arugments
  private debounce(callback: any, delay: number) {
    let timer: any
    return () => {
      clearTimeout(timer)
      timer = setTimeout(callback, delay)
    }
  }
}

export class DOMConnector {
  private svg: SVGElement
  private line: SVGElement

  constructor(
    private element1: HTMLElement,
    private element2: HTMLElement,
    private options: IOptions
  ) {
    this.initConnection()
    DOMConnectors.getInstance().add(this)
  }

  public destroy() {
    if (this.svg && this.svg.parentElement) {
      this.svg.parentElement.removeChild(this.svg)
    }
  }

  public update() {
    const lineInfo = this.computeLineAttribute()
    this.updateNode(
      this.svg,
      {
        width: Math.max(2, lineInfo.width),
        height: Math.max(2, lineInfo.height)
      },
      {
        width: Math.max(2, lineInfo.width),
        height: Math.max(2, lineInfo.height),
        top: Math.min(lineInfo.from.top, lineInfo.to.top) + "px",
        left: Math.min(lineInfo.from.left, lineInfo.to.left) + "px",
        position: "absolute",
        pointerEvents: "none",
        zIndex: 10
      }
    )
    this.updateNode(this.line, {
      x1: lineInfo.from.left > lineInfo.to.left ? lineInfo.width : 0,
      y1: lineInfo.to.top < lineInfo.from.top ? lineInfo.height : 0,
      x2: lineInfo.from.left > lineInfo.to.left ? 0 : lineInfo.width,
      y2: lineInfo.to.top < lineInfo.from.top ? 0 : lineInfo.height,
      class: this.options.className
    })
  }

  private computeLineAttribute(): {
    from: IPosition
    to: IPosition
    width: number
    height: number
  } {
    const from: IPosition = this.computePosition(
      this.options.from,
      this.element1
    )
    const to: IPosition = this.computePosition(this.options.to, this.element2)

    return {
      from,
      to: to,
      width: Math.abs(from.left - to.left),
      height: Math.abs(from.top - to.top)
    }
  }

  private computePosition(position: string, element: HTMLElement): IPosition {
    const bounds = this.getPosition(element)

    const pos: IPosition = { top: bounds.y, left: bounds.x }
    const splitPosition = position.split("-")
    switch (splitPosition[0]) {
      case "middle":
        pos.top = bounds.y + bounds.height / 2
        break

      case "bottom":
        pos.top = bounds.y + bounds.height
        break
    }

    switch (splitPosition[1]) {
      case "middle":
        pos.left = bounds.x + bounds.width / 2
        break

      case "right":
        pos.left = bounds.x + bounds.width
        break
    }
    return pos
  }

  private initConnection() {
    const lineInfo = this.computeLineAttribute()

    this.svg = this.createNode("svg")
    document.body.appendChild(this.svg)

    this.line = this.createNode("line")
    this.svg.appendChild(this.line)
    this.update()
  }

  private createNode(
    type: string,
    attributes: any = {},
    styles: any = {}
  ): SVGElement {
    const node = document.createElementNS("http://www.w3.org/2000/svg", type)
    this.updateNode(node, attributes, styles)
    return node
  }

  private updateNode(
    node: SVGElement,
    attributes: any = {},
    styles: any = {}
  ): void {
    Object.keys(attributes).forEach(attr => {
      // Convert attributes to CamelCase to kebab-case
      node.setAttribute(
        attr.replace(/[A-Z]/g, match => "-" + match.toLowerCase()),
        attributes[attr]
      )
    })

    Object.keys(styles).forEach((style: any) => {
      node.style[style] = styles[style]
    })
  }

  private getPosition(element: any) {
    // From https://www.kirupa.com/html5/get_element_position_using_javascript.htm
    // let xPos = 0
    // let yPos = 0
    const bounds = element.getBoundingClientRect()

    // while (element) {
    //   if (element.tagName === "BODY") {
    //     // deal with browser quirks with body/window/document and page scroll
    //     const xScroll =
    //       element.scrollLeft || document.documentElement.scrollLeft
    //     const yScroll = element.scrollTop || document.documentElement.scrollTop

    //     xPos += element.offsetLeft - xScroll + element.clientLeft
    //     yPos += element.offsetTop - yScroll + element.clientTop
    //   } else {
    //     // Not define on SVG element for example
    //     if (typeof element.offsetLeft === "undefined") {
    //       xPos += bounds.left
    //       yPos += bounds.top
    //       break
    //     } else {
    //       // for all other non-BODY elements
    //       xPos += element.offsetLeft - element.scrollLeft + element.clientLeft
    //       yPos += element.offsetTop - element.scrollTop + element.clientTop
    //     }
    //   }

    //   element = element.offsetParent
    // }
    // return {
    //   x: xPos,
    //   y: yPos,
    //   width: bounds.width,
    //   height: bounds.height
    // }
    return bounds
  }
}

export function connect(
  element1: HTMLElement,
  element2: HTMLElement,
  options: any = {}
) {
  return new DOMConnector(element1, element2, options)
}
