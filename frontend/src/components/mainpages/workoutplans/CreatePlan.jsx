import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import { Colors } from "../../common/Colors";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";

const Item = ({ id, text, index, moveItem, type, menu }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type,
    item: { id, index, text },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        width: "200px",
        height: "32px",
        padding: "8px",
        marginBottom: "4px",
        borderRadius: "5px",
        backgroundColor: menu === "menu1" ? Colors.darkBlue : Colors.gray,
      }}
    >
      {text}
    </div>
  );
};

const DropArea = ({
  moveItem,
  droppedItems,
  setDroppedItems,
  menu1Items,
  menu2Items,
  planTitle,
  setPlanTitle,
}) => {
  const [exerciseValues, setExerciseValues] = useState({});

  const handleChange = (id, field, value) => {
    console.log("handleChange called with:", id, field, value); // Log the parameters
    setExerciseValues((prevValues) => ({
      ...prevValues,
      [id]: {
        ...prevValues[id],
        [field]: value,
      },
    }));
  };

  const handleMainDrop = (item) => {
    const updatedDroppedItems = [...droppedItems, { ...item, items: [] }];
    setDroppedItems(updatedDroppedItems);
  };

  const handleMenu2Drop = (menu1Id, item) => {
    const updatedDroppedItems = droppedItems.map((droppedItem) => {
      if (droppedItem.id === menu1Id) {
        return {
          ...droppedItem,
          items: [...droppedItem.items, item],
        };
      }
      return droppedItem;
    });
    setDroppedItems(updatedDroppedItems);
  };

  const handleNestedRemoveItem = (menu1Id, itemId) => {
    const updatedDroppedItems = droppedItems.map((droppedItem) => {
      if (droppedItem.id === menu1Id) {
        return {
          ...droppedItem,
          items: droppedItem.items.filter((item) => item.id !== itemId),
        };
      }
      return droppedItem;
    });
    setDroppedItems(updatedDroppedItems);
    // Remove exercise values from state when item is removed
    setExerciseValues((prevValues) => {
      const updatedValues = { ...prevValues };
      delete updatedValues[itemId];
      return updatedValues;
    });
  };
  const handleMainRemoveItem = (menu1Id) => {
    const updatedDroppedItems = droppedItems.filter(
      (droppedItem) => droppedItem.id !== menu1Id
    );
    setDroppedItems(updatedDroppedItems);
    // Remove exercise values from state when routine is removed
    setExerciseValues((prevValues) => {
      const updatedValues = { ...prevValues };
      Object.keys(updatedValues).forEach((key) => {
        if (key.startsWith(`${menu1Id}-`)) {
          delete updatedValues[key];
        }
      });
      return updatedValues;
    });
  };

  const handleShare = async () => {
    try {
      const routinesData = droppedItems.map((routine) => ({
        name: routine.text,
        exercises: routine.items.map((exercise) => ({
          name: exercise.text,
          sets: exerciseValues[exercise.id]?.sets || 0,
          repetitions: exerciseValues[exercise.id]?.repetitions || 0,
          weight: exerciseValues[exercise.id]?.weight || 0,
          note: exerciseValues[exercise.id]?.note || "",
        })),
      }));

      const data = {
        planName: planTitle, // Use the planTitle state
        routines: routinesData,
      };
      console.log("Data to be sent to backend:", data); // Log the data

      const response = await axios.post("http://localhost:8080/wplan", data);
      console.log("Workout plan saved:", response.data);
      // Reset states after sharing
      setPlanTitle("");
      setDroppedItems([]);
      setExerciseValues({});
    } catch (error) {
      console.error("Error saving workout plan:", error);
      // Handle error
    }
  };

  return (
    <div
      style={{
        minHeight: "300px",
        width: "500px",
        alignItems: "center",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={
          useDrop({
            accept: "MENU1_ITEM",
            drop: (item) => handleMainDrop(item),
          })[1]
        }
        style={{
          minHeight: "300px",
          width: "500px",
          alignItems: "center",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ color: "black" }}>Fitness Plan Template</h3>
        <TextField
          id="outlined-basic"
          placeholder="Plan Title"
          variant="outlined"
          value={planTitle}
          onChange={(e) => {
            console.log("New plan title:", e.target.value);
            setPlanTitle(e.target.value);
          }}
          sx={{
            marginBottom: "5px",
            width: "300px",
            "& input": {
              color: Colors.white, // Set text color to black
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "black",
              borderColor: "green", // Set default border color to orange
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: Colors.primary, // Set border color to orange on hover
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: Colors.primary, // Set border color to orange on focus
              },
            "& .MuiOutlinedInput-root.Mui-focused input": {
              color: Colors.white, // Set font color to orange on focus
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: Colors.white, // Set label text color to yellow on focus
            },
            "& .MuiInputLabel-root": {
              color: Colors.white, // Set label text color to orange
            },
            "& textarea": {
              color: Colors.white, // Set text color to white
            },

            "& textarea:focus": {
              color: Colors.white, // Set text color to white on focus
            },
          }}
        />

        {droppedItems.map((droppedItem) => (
          <DropItem
            key={droppedItem.id}
            droppedItem={droppedItem}
            menu2Items={menu2Items}
            handleMenu2Drop={handleMenu2Drop}
            handleMainRemoveItem={handleMainRemoveItem}
            handleNestedRemoveItem={handleNestedRemoveItem}
            exerciseValues={exerciseValues}
            handleChange={handleChange}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          backgroundColor: Colors.primary,
          padding: "12px",
          borderRadius: "5px",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          cursor: "pointer",
        }}
        onClick={handleShare}
      >
        <ShareIcon sx={{ color: "white" }} />
      </div>
    </div>
  );
};

const DropItem = ({
  droppedItem,
  menu2Items,
  handleMenu2Drop,
  handleNestedRemoveItem,
  handleMainRemoveItem,
  exerciseValues,
  handleChange,
}) => {
  const menu2DropRef = useDrop({
    accept: "MENU2_ITEM",
    drop: (draggedItem) => handleMenu2Drop(droppedItem.id, draggedItem),
  });

  return (
    <div
      key={droppedItem.id}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px",
        width: "700px",
        flexDirection: "column",
        borderRadius: "5px",
        backgroundColor: Colors.darkBlue,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "550px",
        }}
      >
        <h3>{droppedItem.text}</h3>
        <DeleteIcon
          onClick={() => handleMainRemoveItem(droppedItem.id, droppedItem.id)}
          style={{
            marginLeft: "auto",
            cursor: "pointer",
            color: "white",
          }}
        />
      </div>
      {droppedItem.items.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          style={{
            margin: "4px 0",
            display: "flex",
            padding: "8px",
            alignItems: "flex-center",
            flexDirection: "column",
            borderRadius: "5px",
            backgroundColor: Colors.gray,
            color: "black",
            width: "650px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{}}>{item.text}</div>
            <DeleteIcon
              onClick={() => handleNestedRemoveItem(droppedItem.id, item.id)}
              style={{
                marginLeft: "auto",
                cursor: "pointer",
                color: "black",
              }}
            />
          </div>
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "30px",
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "5px",
              }}
            >
              <TextField
                id={`${item.id}-sets`}
                placeholder="Sets"
                value={exerciseValues[item.id]?.sets || ""}
                onChange={(e) => handleChange(item.id, "sets", e.target.value)}
                variant="outlined"
                sx={{
                  "& input": {
                    color: Colors.white, // Set text color to black
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "black", // Set background color to black
                    borderColor: "green", // Set default border color to orange
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: Colors.primary, // Set border color to orange on hover
                    },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: Colors.primary, // Set border color to orange on focus
                    },
                  "& .MuiOutlinedInput-root.Mui-focused input": {
                    color: Colors.primary, // Set font color to orange on focus
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: Colors.white, // Set label text color to yellow on focus
                  },
                  "& .MuiInputLabel-root": {
                    color: Colors.primary,
                    // Set label text color to orange
                  },
                }}
              />
            </div>
            <div style={{ flex: 1, padding: "5px" }}>
              <TextField
                id={`${item.id}-repetitions`}
                placeholder="Repetitions"
                value={exerciseValues[item.id]?.repetitions || ""}
                onChange={(e) =>
                  handleChange(item.id, "repetitions", e.target.value)
                }
                variant="outlined"
                sx={{
                  "& input": {
                    color: Colors.white, // Set text color to black
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "black", // Set background color to black
                    borderColor: "green",
                    width: "125px", // Set default border color to orange
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: Colors.primary, // Set border color to orange on hover
                    },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: Colors.primary, // Set border color to orange on focus
                    },
                  "& .MuiOutlinedInput-root.Mui-focused input": {
                    color: Colors.primary, // Set font color to orange on focus
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: Colors.white, // Set label text color to yellow on focus
                  },
                  "& .MuiInputLabel-root": {
                    color: Colors.primary, // Set label text color to orange
                  },
                }}
              />
            </div>
            <div style={{ flex: 1, padding: "5px" }}>
              <TextField
                id={`${item.id}-weight`}
                placeholder="Weight(kg)"
                value={exerciseValues[item.id]?.weight || ""}
                onChange={(e) =>
                  handleChange(item.id, "weight", e.target.value)
                }
                variant="outlined"
                sx={{
                  "& input": {
                    color: Colors.white, // Set text color to black
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "black", // Set background color to black
                    borderColor: "green", // Set default border color to orange
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: Colors.primary, // Set border color to orange on hover
                    },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: Colors.primary, // Set border color to orange on focus
                    },
                  "& .MuiOutlinedInput-root.Mui-focused input": {
                    color: Colors.primary, // Set font color to orange on focus
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: Colors.white, // Set label text color to yellow on focus
                  },
                  "& .MuiInputLabel-root": {
                    color: Colors.primary, // Set label text color to orange
                  },
                }}
              />
            </div>
            <div style={{ flex: 2, padding: "5px" }}>
              <TextField
                id={`${item.id}-note`}
                multiline
                placeholder="Type something…"
                value={exerciseValues[item.id]?.note || ""}
                onChange={(e) => handleChange(item.id, "note", e.target.value)}
                variant="outlined"
                sx={{
                  "& input": {
                    color: Colors.white, // Set text color to black
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "black", // Set background color to black
                    borderColor: "green", // Set default border color to orange
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: Colors.primary, // Set border color to orange on hover
                    },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: Colors.primary, // Set border color to orange on focus
                    },
                  "& .MuiOutlinedInput-root.Mui-focused input": {
                    color: Colors.primary, // Set font color to orange on focus
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: Colors.white, // Set label text color to yellow on focus
                  },
                  "& .MuiInputLabel-root": {
                    color: Colors.primary, // Set label text color to orange
                  },
                  "& textarea": {
                    color: Colors.white, // Set text color to white
                  },

                  "& textarea:focus": {
                    color: Colors.primary, // Set text color to white on focus
                  },
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <div ref={menu2DropRef[1]} style={{ height: "50px", marginTop: "10px" }}>
        Drop Exercises here
      </div>
    </div>
  );
};

const Menu = ({ moveItem, items, type, menu }) => {
  return (
    <div>
      {items.map((item, index) => (
        <Item
          key={item.id}
          id={item.id}
          text={item.text}
          index={index}
          moveItem={moveItem}
          type={type}
          menu={menu}
        />
      ))}
    </div>
  );
};

function CreatePlan() {
  const [backgroundHeight, setBackgroundHeight] = useState("auto");
  const [planTitle, setPlanTitle] = useState("");

  const navigate = useNavigate();

  const gotToMySharedPlansPage = () => {
    navigate("/my_workout_plans");
  };
  const gotToPlansHomePage = () => {
    navigate("/shared_workout_plans");
  };

  const [menu1Items, setMenu1Items] = useState([
    { id: 1, text: "Full Body Workout" },
    { id: 2, text: "Push Workout" },
    { id: 3, text: "Pull Workout" },
    { id: 4, text: "Leg Day" },
    { id: 5, text: "Core and Abs" },
    { id: 6, text: "Core and Abs" },
  ]);

  const [menu2Items, setMenu2Items] = useState([
    { id: 7, text: "Squats" },
    { id: 8, text: "Deadlifts" },
    { id: 9, text: "Pull-Ups" },
    { id: 10, text: "Dumbbell Chest Press" },
    { id: 11, text: "Overhead Press" },
    { id: 12, text: "Barbell Rows" },
    { id: 13, text: "Calf Raises" },
    { id: 14, text: "Russian Twists" },
    { id: 15, text: "Bicycle Crunches" },
  ]);

  const [droppedItems, setDroppedItems] = useState([]);

  useEffect(() => {
    const maxHeight = Math.max(
      document.getElementById("drop-area").scrollHeight,
      document.getElementById("menu-1").scrollHeight,
      document.getElementById("menu-2").scrollHeight
    );
    setBackgroundHeight(maxHeight + "px");
  }, [droppedItems, menu1Items, menu2Items]);

  const moveItem = (dragIndex, hoverIndex, sourceMenu) => {
    if (sourceMenu === "menu1") {
      const draggedItem = menu1Items[dragIndex];
      const updatedItems = [...menu1Items];
      updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, draggedItem);
      setMenu1Items(updatedItems);
    } else if (sourceMenu === "menu2") {
      const draggedItem = menu2Items[dragIndex];
      const updatedItems = [...menu2Items];
      updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, draggedItem);
      setMenu2Items(updatedItems);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",

        backgroundSize: "cover",
        backgroundBlendMode: "overlay",
        backgroundPosition: "center",
        margin: "-8px",
        position: "relative",
        minHeight: "100vh",
        height: backgroundHeight,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "row",
          mt: "20px",
          padding: "100px",
          width: "10030px",

          height: "100%",
        }}
      >
        {" "}
        <Tooltip title="My FitnessPlans">
          <div
            style={{
              display: "flex",
              backgroundColor: Colors.secondary,
              padding: "12px",
              borderRadius: "5px",
              alignItems: "center",
              justifyContent: "center",
              width: "30px",
              marginRight: "10px",
              height: "30px",
              cursor: "pointer",
            }}
            onClick={gotToMySharedPlansPage}
          >
            <ShareIcon sx={{ color: "white" }} />
          </div>
        </Tooltip>
        <Tooltip title="FitnessPlans">
          <div
            style={{
              display: "flex",
              backgroundColor: Colors.secondary,
              padding: "12px",
              borderRadius: "5px",
              alignItems: "center",
              justifyContent: "center",
              width: "30px",
              height: "30px",
              cursor: "pointer",
            }}
            onClick={gotToPlansHomePage}
          >
            <ViewTimelineIcon sx={{ color: "white" }} />
          </div>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          position: "absolute",
          width: "100%",
          height: "80%",

          padding: "20px",
        }}
      >
        <Card
          id="menu-1"
          sx={{
            display: "flex",
            width: "20%",
            minHeight: "70%",
            marginRight: "20px",

            justifyContent: "flex-start",
            alignItems: "center",
            color: "white",

            flexDirection: "column",
          }}
        >
          <DndProvider backend={HTML5Backend}>
            <h3 style={{ color: "black" }}>Routines</h3>

            <Menu
              moveItem={(dragIndex, hoverIndex) =>
                moveItem(dragIndex, hoverIndex, "menu1")
              }
              items={menu1Items}
              type="MENU1_ITEM"
              menu="menu1"
            />
          </DndProvider>
        </Card>
        <Card
          id="menu-2"
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
            width: "20%",
            minHeight: "70%",
          }}
        >
          <DndProvider backend={HTML5Backend}>
            <h3>Exercises</h3>
            <Menu
              moveItem={(dragIndex, hoverIndex) =>
                moveItem(dragIndex, hoverIndex, "menu2")
              }
              items={menu2Items}
              type="MENU2_ITEM"
              menu="menu2"
            />
          </DndProvider>
        </Card>
        <Card
          id="drop-area"
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
            width: "60%",
            minHeight: "50%",
            marginLeft: "20px",
            color: "white",
            fontSize: "medium",

            border: "2px dotted black",
            borderRadius: "10px",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <DndProvider backend={HTML5Backend}>
            <DropArea
              moveItem={moveItem}
              droppedItems={droppedItems}
              setDroppedItems={setDroppedItems}
              menu1Items={menu1Items}
              menu2Items={menu2Items}
              planTitle={planTitle}
              setPlanTitle={setPlanTitle}
            />
          </DndProvider>
        </Card>
      </Box>
    </Box>
  );
}

export default CreatePlan;
