import React, { useState } from "react";
import {
  Form,
  Columns,
  Container,
  Notification,
  Section,
  Box,
  Button
} from "react-bulma-components";

import "react-bulma-components/dist/react-bulma-components.min.css";
import "./styles.css";
import Disks from "./data.json";

const { Input, Field, Control, Label, Select, Checkbox } = Form;

export default function App() {
  const [numDisk, setNumDisk] = useState(10);
  const [diskSize, setDiskSize] = useState(10);
  const [usableSpace, setUsableSpace] = useState(200);
  const [showFlexible, setShowFlexible] = useState(false);
  const [flexibleNode, setFlexibleNode] = useState(0);
  const [k, setK] = useState(2);
  const [m, setM] = useState(1);
  const [fullRatio, setFullRatio] = useState(0.95);

  const diskTrueSize = diskSize * 0.909495;
  const onenode = Math.round(diskTrueSize * numDisk * fullRatio);
  const erasureRatio = (k + m) / k;

  const forward = Array(flexibleNode)
    .fill(1)
    .map((x, y) => x + y);
  const backward = Array(flexibleNode)
    .fill(1)
    .map((x, y) => x + y)
    .reverse();

  const handlePlus = () => setFlexibleNode(flexibleNode + 1);
  const handleMinus = () => {
    setFlexibleNode(flexibleNode - 1);
    if (flexibleNode < 0) {
      setFlexibleNode(0);
    }
  };
  const handleShowFlexible = (event) => {
    setFlexibleNode(0);
    setShowFlexible(event.target.checked);
  };

  let num3 = Math.ceil(usableSpace / (onenode / 3));
  if (num3 < 3) {
    num3 = 3;
  }

  let numec = Math.ceil(usableSpace / (onenode / erasureRatio));
  if (numec < 3) {
    numec = 3;
  }

  return (
    <div className="App">
      <Section>
        <Container>
          <Notification color="success">
            <h1 className="title is-1">Ceph Calculator</h1>
          </Notification>
          <Columns>
            {/* UserInput */}
            <Columns.Column>
              <Box>
                <Field>
                  <Label>Nombre Disque</Label>
                  <Field kind="addons">
                    <Control>
                      <Input
                        onChange={(event) =>
                          setNumDisk(parseInt(event.target.value, 10))
                        }
                        value={numDisk}
                        type="number"
                      />
                    </Control>
                    <Control>
                      <Button isStatic>per nodes</Button>
                    </Control>
                  </Field>
                </Field>
                <Field>
                  <Label>Disque en BASE 10</Label>
                  <Field>
                    <Control>
                      <Select
                        onChange={(event) => setDiskSize(event.target.value)}
                        value={diskSize}
                      >
                        {Disks.map((disk, i) => (
                          <option key={i} value={disk.value}>
                            {disk.text}
                          </option>
                        ))}
                      </Select>
                    </Control>
                  </Field>
                </Field>
                <Field>
                  <Label>Espace Utile cible</Label>
                  <Field kind="addons">
                    <Control>
                      <Input
                        type="number"
                        onChange={(event) =>
                          setUsableSpace(parseInt(event.target.value, 10))
                        }
                        value={usableSpace}
                      />
                    </Control>
                    <Control>
                      <Button isStatic>TiB</Button>
                    </Control>
                  </Field>
                </Field>
              </Box>
            </Columns.Column>

            {/* Advanced */}
            <Columns.Column>
              <Box>
                <Field>
                  <Label>Flexible Nodes</Label>
                  <Field>
                    <Control>
                      <Checkbox
                        onChange={handleShowFlexible}
                        checked={showFlexible}
                      >
                        Enable
                      </Checkbox>
                    </Control>
                  </Field>
                </Field>
                {
                  /* if showFlexible is checked, render buttons*/
                  showFlexible && (
                    <Button.Group>
                      <Button color="success" onClick={handlePlus}>
                        +
                      </Button>
                      <Button color="info" onClick={handleMinus}>
                        -
                      </Button>
                    </Button.Group>
                  )
                }

                <Field>
                  <Label>Full Ratio</Label>
                  <Control>
                    <Input
                      type="number"
                      onChange={(event) =>
                        setFullRatio(parseInt(event.target.value, 10))
                      }
                      value={fullRatio}
                    />
                  </Control>
                </Field>

                <Field>
                  <Label>Erasure K M</Label>
                  <Control>
                    <Field kind="group">
                      <Input
                        type="number"
                        onChange={(event) =>
                          setK(parseInt(event.target.value, 10))
                        }
                        value={k}
                      />
                      <Input
                        type="number"
                        onChange={(event) =>
                          setM(parseInt(event.target.value, 10))
                        }
                        value={m}
                      />
                    </Field>
                  </Control>
                </Field>
              </Box>
            </Columns.Column>

            {/* Summary*/}
            <Columns.Column>
              <Box>
                <strong>One Node summary</strong>
                <p>BASE 2</p>
                <p>RAW per Node : {onenode} TiB</p>
                <p>CPU : {numDisk + 4} cores</p>
                <p>MEM : {numDisk * 6 + 20} GB</p>
              </Box>
            </Columns.Column>
          </Columns>
          <Columns>
            <Columns.Column>
              <h2 className="title is-2">Replica 3</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Number of Node</th>
                    <th>Raw Space</th>
                    <th>Usable Space</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    /* */
                    backward.map((index) => (
                      <tr key={index}>
                        <td>{num3 - index}</td>
                        <td>{onenode * (num3 - index)}</td>
                        <td>{(onenode * (num3 - index)) / 3}</td>
                      </tr>
                    ))
                  }
                  <tr className="is-selected">
                    <td>{num3}</td>
                    <td>{onenode * num3}</td>
                    <td className="has-text-weight-bold">
                      {(onenode * num3) / 3}
                    </td>
                  </tr>
                  {forward.map((index) => (
                    <tr key={index}>
                      <td>{num3 + index}</td>
                      <td>{onenode * (num3 + index)}</td>
                      <td>{(onenode * (num3 + index)) / 3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Columns.Column>
            <Columns.Column>
              <h2 className="title is-2">
                Erasure Coding {k}:{m}
              </h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Number of Node</th>
                    <th>Raw Space</th>
                    <th>Usable Space</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    /* */
                    backward.map((index) => (
                      <tr key={index}>
                        <td>{numec - index}</td>
                        <td>{onenode * (numec - index)}</td>
                        <td>{(onenode * (numec - index)) / erasureRatio}</td>
                      </tr>
                    ))
                  }
                  <tr className="is-selected">
                    <td>{numec}</td>
                    <td>{onenode * numec}</td>
                    <td className="has-text-weight-bold">
                      {(onenode * numec) / erasureRatio}
                    </td>
                  </tr>
                  {forward.map((index) => (
                    <tr key={index}>
                      <td>{numec + index}</td>
                      <td>{onenode * (numec + index)}</td>
                      <td>{(onenode * (numec + index)) / erasureRatio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Columns.Column>
          </Columns>
        </Container>
      </Section>
    </div>
  );
}
