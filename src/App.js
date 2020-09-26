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
import Logo from "./assets/ceph-logo.png";

const { Input, Field, Control, Label, Select } = Form;

export default function App() {
  const [numDisk, setNumDisk] = useState(12);
  const [diskSize, setDiskSize] = useState(12);
  const [usableSpace, setUsableSpace] = useState(200);
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
    flexibleNode - 1 < 0
      ? setFlexibleNode(0)
      : setFlexibleNode(flexibleNode - 1);
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
          {/* Banner + Logo */}
          <Notification color="success">
            <p className="title is-1">
              Ceph Calculator <img src={Logo} width="42px" alt="CephLogo" />
            </p>
          </Notification>
          <strong>Pre-made configurations</strong>
          <Button.Group>
            <Button
              color="light"
              onClick={() => {
                setNumDisk(12);
                setDiskSize(12);
                setUsableSpace(500);
                setK(4);
                setM(2);
              }}
            >
              Archive - HDD 500TiB
            </Button>
            <Button
              color="light"
              onClick={() => {
                setNumDisk(24);
                setDiskSize(4);
                setUsableSpace(200);
                setK(4);
                setM(2);
              }}
            >
              VM & Containers - SSD 200TiB
            </Button>
          </Button.Group>
          <Columns>
            {/* UserInput */}
            <Columns.Column>
              <Box>
                <Field>
                  <Label>Number of Disks</Label>
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
                      <Button isStatic>per node</Button>
                    </Control>
                  </Field>
                </Field>
                <Field>
                  <Label>Disk size - BASE 10</Label>
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
                  <Label>Usable Space Wanted</Label>
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
                  <Button.Group>
                    <Button color="warning" onClick={handlePlus}>
                      + 1
                    </Button>
                    <Button color="danger" onClick={handleMinus}>
                      - 1
                    </Button>
                  </Button.Group>
                </Field>
                <Field>
                  <Label>Full Ratio</Label>
                  <Control>
                    <Input
                      type="number"
                      onChange={(event) =>
                        setFullRatio(parseFloat(event.target.value, 10))
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
                    <th>Number of Node (+1)</th>
                    <th>Raw Space in TiB</th>
                    <th>Usable Space in TiB</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    /* */
                    backward.map((index) => (
                      <tr key={index}>
                        <td>{num3 - index + 1}</td>
                        <td>{onenode * (num3 - index + 1)}</td>
                        <td>{(onenode * (num3 - index)) / 3}</td>
                      </tr>
                    ))
                  }
                  <tr className="is-selected">
                    <td>{num3 + 1}</td>
                    <td>{onenode * (num3 + 1)}</td>
                    <td className="has-text-weight-bold">
                      {(onenode * num3) / 3}
                    </td>
                  </tr>
                  {forward.map((index) => (
                    <tr key={index}>
                      <td>{num3 + index + 1}</td>
                      <td>{onenode * (num3 + index + 1)}</td>
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
                    <th>Number of Node (+1)</th>
                    <th>Raw Space in TiB</th>
                    <th>Usable Space in TiB</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    /* */
                    backward.map((index) => (
                      <tr key={index}>
                        <td>{numec - index + 1}</td>
                        <td>{onenode * (numec - index + 1)}</td>
                        <td>{(onenode * (numec - index)) / erasureRatio}</td>
                      </tr>
                    ))
                  }
                  <tr className="is-selected">
                    <td>{numec + 1}</td>
                    <td>{onenode * (numec + 1)}</td>
                    <td className="has-text-weight-bold">
                      {(onenode * numec) / erasureRatio}
                    </td>
                  </tr>
                  {forward.map((index) => (
                    <tr key={index}>
                      <td>{numec + index + 1}</td>
                      <td>{onenode * (numec + index + 1)}</td>
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
