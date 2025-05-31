import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import { io } from "socket.io-client";

const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 40;
const SOCKET_URL = "http://localhost:3000"; // Cambia si tu backend está en otro host/puerto

const Whiteboard = ({ roomName = "default-room", rol = "alumno" }) => {
  const [lines, setLines] = useState([]);
  const [texts, setTexts] = useState([]);
  const [mode, setMode] = useState("draw");
  const [isAddingText, setIsAddingText] = useState(false);
  const [newTextPos, setNewTextPos] = useState({ x: MARGIN_LEFT, y: 8 });
  const [inputValue, setInputValue] = useState("");
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const isDrawing = useRef(false);
  const inputRef = useRef();
  const socketRef = useRef();

  // Conexión a socket y eventos colaborativos
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("join-whiteboard", roomName);

    socket.on("whiteboard-state", (data) => {
      setLines(data.lines || []);
      setTexts(data.texts || []);
    });

    socket.on("draw-line", (line) => {
      setLines((prev) => [...prev, line]);
    });

    socket.on("add-text", (text) => {
      setTexts((prev) => [...prev, text]);
    });

    socket.on("whiteboard-state", (data) => {
      setLines(data.lines || []);
      setTexts(data.texts || []);
    });

    socket.on("clear-whiteboard", () => {
      setLines([]);
      setTexts([]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomName]);

  // Dinamismo del tamaño del stage
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // --- Dibujo colaborativo ---
  const handleMouseDown = (e) => {
    if (rol !== "profesor") return; // Solo el profe puede dibujar
    if (mode !== "draw") return;
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = { points: [pos.x, pos.y] };
    setLines((prev) => [...prev, newLine]);
    socketRef.current.emit("draw-line", newLine);
  };

  const handleMouseMove = (e) => {
    if (rol !== "profesor") return; // Solo el profe puede dibujar
    if (!isDrawing.current || mode !== "draw") return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setLines((prev) => {
      const lastLine = prev[prev.length - 1];
      const updatedLine = {
        ...lastLine,
        points: [...lastLine.points, point.x, point.y],
      };
      const newLines = prev.slice(0, -1).concat(updatedLine);
      socketRef.current.emit("draw-line", updatedLine);
      return newLines;
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    setLines([]);
    setTexts([]);
    setIsAddingText(false);
    setInputValue("");
    socketRef.current.emit("clear-whiteboard");
  };

  const handleStageClick = (e) => {
    if (mode !== "text" || isAddingText) return;
    if (e.target === e.target.getStage()) {
      const pointer = e.target.getStage().getPointerPosition();
      setNewTextPos({ x: MARGIN_LEFT, y: pointer.y });
      setIsAddingText(true);
      setInputValue("");
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.selectionStart = 0;
          inputRef.current.selectionEnd = 0;
          inputRef.current.style.height = "auto";
          inputRef.current.style.height = inputRef.current.scrollHeight + "px";
        }
      }, 0);
    }
  };

  // --- Cálculo de límites para textarea ---
  const textareaWidth = Math.max(
    100,
    stageSize.width - MARGIN_LEFT - MARGIN_RIGHT
  );
  const bottomPadding = 48 + 8; // zona de botones + margen
  const espacioDisponible = Math.max(
    38, // minHeight
    stageSize.height - newTextPos.y - bottomPadding
  );
  const textareaTop = Math.min(
    newTextPos.y,
    stageSize.height - bottomPadding - 100
  );
  const textareaHeight = Math.min(300, espacioDisponible);

  const limitedTextPos = {
    x: MARGIN_LEFT,
    y: textareaTop,
  };

  // Altura dinámica del textarea al escribir
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, textareaHeight) + "px";
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim() !== "") {
      const newText = { x: MARGIN_LEFT, y: limitedTextPos.y, text: inputValue };
      setTexts((prev) => [...prev, newText]);
      socketRef.current.emit("add-text", newText);
    }
    setIsAddingText(false);
    setInputValue("");
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Escape" || (e.key === "Enter" && e.ctrlKey)) {
      handleInputBlur();
    }
  };

  const changeMode = (newMode) => {
    if (isAddingText && inputValue.trim() !== "") {
      const newText = { x: MARGIN_LEFT, y: limitedTextPos.y, text: inputValue };
      setTexts((prev) => [...prev, newText]);
      socketRef.current.emit("add-text", newText);
      setIsAddingText(false);
      setInputValue("");
    }
    setMode(newMode);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full h-full bg-black p-2 rounded-lg"
      style={{ position: "relative", height: "100%" }}
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height - 48}
        className="rounded-md"
        style={{
          border: "2px solid rgb(72, 70, 70)",
          background: "#000",
          flexGrow: 1,
        }}
        onClick={handleStageClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          <rect width={stageSize.width} height={stageSize.height - 48} fill="#000" />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#fff"
              strokeWidth={3}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
          {texts.map((t, i) => (
            <Text
              key={i}
              x={MARGIN_LEFT}
              y={t.y}
              text={t.text}
              fontSize={22}
              fontFamily="Arial"
              fill="#fff"
              draggable={rol === "profesor"}
              width={textareaWidth}
            />
          ))}
        </Layer>
      </Stage>

      {mode === "text" && isAddingText && (
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          style={{
            position: "absolute",
            top: limitedTextPos.y,
            left: MARGIN_LEFT,
            fontSize: 22,
            border: "none",
            borderRadius: 0,
            padding: 4,
            outline: "none",
            color: "#fff",
            background: "transparent",
            zIndex: 10,
            resize: "none",
            width: textareaWidth,
            minHeight: 38,
            maxHeight: textareaHeight,
            overflow: "hidden",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            maxWidth: textareaWidth,
          }}
          placeholder=""
          autoFocus
          rows={1}
        />
      )}
      <div className="flex justify-between mb-2 mt-1">
        <div className="flex gap-2">
          {/* TODOS ven "Escribir" */}
          <button
            className={`px-4 py-1 font-bold rounded transition ${
              mode === "text"
                ? "bg-white text-black"
                : "bg-white text-black border border-none"
            }`}
            onClick={() => changeMode("text")}
            disabled={mode === "text"}
          >
            Escribir
          </button>
          {/* Solo PROFESOR ve "Dibujar" */}
          {rol === "profesor" && (
            <button
              className={`px-4 py-1 font-bold rounded transition ${
                mode === "draw"
                  ? "bg-white text-black"
                  : "bg-white text-black border border-none"
              }`}
              onClick={() => changeMode("draw")}
              disabled={mode === "draw"}
            >
              Dibujar
            </button>
          )}
        </div>
        {/* Solo PROFESOR ve "Limpiar" */}
        {rol === "profesor" && (
          <button
            className="bg-white text-black rounded px-4 py-1 font-bold hover:bg-gray-400 transition ml-4"
            onClick={handleClear}
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
};

export default Whiteboard;
