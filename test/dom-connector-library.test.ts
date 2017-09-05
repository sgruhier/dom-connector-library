import { DOMConnector } from "../src/dom-connector-library"

describe("DOMConnector test", () => {
  it("DOMConnector is instantiable", () => {
    document.body.innerHTML = `
    <div>
      <div id="elt1"/>
      <div id="elt2"/>
    </div>`

    expect(
      new DOMConnector(
        document.getElementById("elt1"),
        document.getElementById("elt2"),
        { from: "bottom-middle", to: "top-middle" }
      )
    ).toBeInstanceOf(DOMConnector)
  })
})
