import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { Text, Billboard } from "@react-three/drei";
import "./BlochSphere.css";
import { Helmet } from "react-helmet";
const Sphere = ({ color }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} transparent opacity={0.2} wireframe />
    </mesh>
  );
};
const Lines = ({ theta, phi }) => {
  const pointsMeridian = [];
  const pointsParallel = [];

  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * 2 * Math.PI;
    pointsMeridian.push(
      new THREE.Vector3(
        Math.sin(angle) * Math.cos(phi),
        Math.sin(angle) * Math.sin(phi),
        Math.cos(angle)
      )
    );
  }

  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * 2 * Math.PI;
    pointsParallel.push(
      new THREE.Vector3(
        Math.sin(theta) * Math.cos(angle),
        Math.sin(theta) * Math.sin(angle),
        Math.cos(theta)
      )
    );
  }

  const intersectionPoint = new THREE.Vector3(
    Math.sin(theta) * Math.cos(phi),
    Math.sin(theta) * Math.sin(phi),
    Math.cos(theta)
  );

  const intersectionLinePoints = [
    new THREE.Vector3(0, 0, 0),
    intersectionPoint,
  ];

  return (
    <>
      <Line points={pointsMeridian} color="blue" lineWidth={4} />
      <Line points={pointsParallel} color="red" lineWidth={4} />
      <Line points={intersectionLinePoints} color="purple" lineWidth={7} />
    </>
  );
};

const Axes = () => {
  const axisLength = 2;

  return (
    <>
      <Line
        points={[
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(axisLength, 0, 0),
        ]}
        color="red"
        lineWidth={2}
      />
      <Billboard position={[axisLength + 0.1, 0, 0]}>
        <Suspense fallback={null}>
          <Text fontSize={0.25}>X</Text>
        </Suspense>
      </Billboard>

      <Line
        points={[
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, axisLength, 0),
        ]}
        color="green"
        lineWidth={2}
      />
      <Billboard position={[0, axisLength + 0.1, 0]}>
        <Suspense fallback={null}>
          <Text fontSize={0.25}>Y</Text>
        </Suspense>
      </Billboard>

      <Line
        points={[
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, axisLength),
        ]}
        color="blue"
        lineWidth={2}
      />
      <Billboard position={[0, 0, axisLength + 0.1]}>
        <Suspense fallback={null}>
          <Text fontSize={0.25}>Z</Text>
        </Suspense>
      </Billboard>
    </>
  );
};
const toPiFractionPolar = (value) => {
  const multiples = [10, 5, 2, 1];
  for (const multiple of multiples) {
    const fraction = (value * multiple) / Math.PI;
    const roundedFraction = Math.round(fraction * 10) / 10;
    if (Number.isInteger(roundedFraction)) {
      return `${roundedFraction}π/${multiple}`;
    }
  }
  return value.toFixed(2);
};

const toPiFractionAzimuth = (value) => {
  const multiples = [12, 6, 4, 3, 2, 1];
  for (const multiple of multiples) {
    const fraction = (value * multiple) / Math.PI;
    const roundedFraction = Math.round(fraction * 10) / 10;
    if (Number.isInteger(roundedFraction)) {
      return `${roundedFraction}π/${multiple}`;
    }
  }
  return value.toFixed(2);
};

const BlochSphere = () => {
  const [theta, setTheta] = useState((Math.PI * 3) / 10);
  const [phi, setPhi] = useState((Math.PI * 7) / 12);
  const [formula, setFormula] = useState("");
  useEffect(() => {
    const cosValue = Math.cos(theta / 2).toFixed(3);
    const sinValue = Math.sin(theta / 2).toFixed(3);
    const expValueReal = Math.sin(theta / 2) * Math.cos(phi);
    const expValueImag = Math.sin(theta / 2) * Math.sin(phi);
    let expValueArg = Math.atan2(expValueImag, expValueReal);
    if (expValueArg < 0) {
      expValueArg = 2 * Math.PI + expValueArg;
    }
    const exvalueformattedwithoutpi = (expValueArg / Math.PI).toFixed(3);
    const thetaFormatted = toPiFractionPolar(theta);
    const phiFormatted = toPiFractionAzimuth(phi);
    let cosValuePart;
    if (cosValue == 0) {
      cosValuePart = "";
    } else if (cosValue == 1) {
      cosValuePart = "|↑〉";
    } else {
      cosValuePart = `${cosValue} |↑〉`;
    }

    let expPart;
    if (exvalueformattedwithoutpi == 0) {
      expPart = "";
      cosValuePart += " + ";
    } else if (exvalueformattedwithoutpi == 0.5) {
      expPart = "i";
      cosValuePart += " + ";
    } else if (exvalueformattedwithoutpi == 1) {
      expPart = "";
      cosValuePart += " - ";
    } else if (exvalueformattedwithoutpi == 1.5) {
      expPart = "i";
      cosValuePart += " - ";
    } else {
      expPart = `exp(i ${exvalueformattedwithoutpi}π)`;
      cosValuePart += " + ";
    }

    const sinValuePart =
      sinValue == 0
        ? ""
        : sinValue == 1
        ? `${expPart} |↓〉`
        : `${sinValue} ${expPart} |↓〉`;
    const formulaString = `|ψ〉 = cos(${thetaFormatted}/2) |↑〉 + sin(${thetaFormatted}/2) exp(i ${phiFormatted}) |↓〉
      |ψ〉 ≈ ${cosValuePart}${sinValuePart ? " " + sinValuePart : ""}`;

    setFormula(formulaString);
  }, [theta, phi]);
  return (
    <div
      style={{
        height: "100vh",
        maxHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Helmet>
        <title>Bloch Sphere Simulator | Quantum Visualization Tool</title>
        <meta
          name="description"
          content="Visualize quantum states with this interactive Bloch Sphere simulator developed by Varol Cagdas Tok. Rotate, zoom, and change polar and azimuthal angles to see the effect."
        />
        <meta
          name="keywords"
          content="Bloch Sphere, quantum states, quantum visualization, simulator, interactive"
        />
        <script type="application/ld+json">
          {`
    {
      "@context": "http://schema.org",
      "@type": "SoftwareApplication",
      "name": "Bloch Sphere Simulator",
      "description": "An interactive tool to visualize quantum states using the Bloch Sphere, developed by Varol Cagdas Tok.",
      "softwareVersion": "1.0",
      "applicationCategory": "Education",
      "operatingSystem": "Cross-platform",
      "author": {
        "@type": "Person",
        "name": "Varol Cagdas Tok"
      }
    }
    `}
        </script>
      </Helmet>

      <header
        style={{
          padding: "10px",
          backgroundColor: "black",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1>Bloch Sphere Simulator</h1>
      </header>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: "60%",
            borderRight: "1px solid white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <Canvas camera={{ position: [2, 0, 4], up: [1, 0, 0] }}>
              <group rotation={[0, Math.PI / 2, 0]}>
                <group rotation={[0, 0, 145 * (Math.PI / 180)]}>
                  <ambientLight intensity={1} />
                  <spotLight position={[15, 20, 5]} angle={0.9} />
                  <Sphere color="lightblue" />
                  <Lines theta={theta} phi={phi} />
                  <Axes />
                  <OrbitControls />
                </group>
              </group>
            </Canvas>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "10px",
              flexWrap: "wrap",
              marginBottom: "50px",
              borderTop: "1px solid white",
            }}
          >
            <label style={{ fontSize: "20px" }}>
              Polar angle θ = {toPiFractionPolar(theta)}:
              <input
                type="range"
                min="0"
                max={Math.PI}
                step={Math.PI / 10}
                value={theta}
                onChange={(e) => setTheta(parseFloat(e.target.value))}
                list="polar-steps"
                style={{
                  fontSize: "28px",
                  marginLeft: "10px",
                  color: "white",
                  width: "200px",
                }}
              />
              <datalist id="polar-steps">
                {Array.from({ length: 11 }, (_, i) => i * (Math.PI / 10)).map(
                  (step) => (
                    <option
                      key={step}
                      value={step}
                      label={toPiFractionPolar(step)}
                    />
                  )
                )}
              </datalist>
            </label>
            <br />
            <label style={{ fontSize: "20px" }}>
              Azimuth φ = {toPiFractionAzimuth(phi)}:
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step={Math.PI / 12}
                value={phi}
                onChange={(e) => setPhi(parseFloat(e.target.value))}
                list="azimuth-steps"
                style={{
                  fontSize: "18px",
                  marginLeft: "10px",
                  color: "white",
                  width: "200px",
                }}
              />
              <datalist id="azimuth-steps">
                {Array.from({ length: 25 }, (_, i) => i * (Math.PI / 12)).map(
                  (step) => (
                    <option
                      key={step}
                      value={step}
                      label={toPiFractionAzimuth(step)}
                    />
                  )
                )}
              </datalist>
            </label>
          </div>
        </div>
        <div
          className="rightside"
          style={{
            width: "40%",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.75)",
          }}
        >
          <div
            style={{
              marginTop: "50px",
              gap: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",

              padding: "40px",
              borderRadius: "20px",
              boxShadow: "4px 4px 20px 20px rgba(150, 150, 150, 0.75)",
            }}
          >
            <h1>Quantum State</h1>
            <pre
              className="preclass"
              style={{
                fontSize: "20px",
                lineHeight: "24px",
                whiteSpace: "pre-wrap",
                wordWrap: "normal",
              }}
            >
              {formula.split("\n")[0]}
            </pre>
            <pre
              className="preclass"
              style={{
                fontSize: "20px",
                lineHeight: "24px",
                whiteSpace: "pre-wrap",
                wordWrap: "normal",
              }}
            >
              {formula.split("\n")[1]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlochSphere;
