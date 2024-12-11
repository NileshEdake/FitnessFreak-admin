"use client";
import React from "react";
import "./addworkout.css";
import { toast } from "react-toastify";

interface Workout {
  name: string;
  description: string;
  durationInMinutes: number;
  exercises: Exercise[];
  imageURL: string;
  imageFile: File | null;
}

interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  imageURL: string;
  imageFile: File | null;
}

const page = () => {
  const [workout, setWorkout] = React.useState<Workout>({
    name: "",
    description: "",
    durationInMinutes: 0,
    exercises: [],
    imageURL: "",
    imageFile: null,
  });

  const [exercise, setExercise] = React.useState<Exercise>({
    name: "",
    description: "",
    sets: 0,
    reps: 0,
    imageURL: "",
    imageFile: null,
  });
  const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkout({
      ...workout,
      [e.target.name]: e.target.value,
    });
    // setExercise({
    //   name: "",
    //   description: "",
    //   sets: 0,
    //   reps: 0,
    //   imageURL: "",
    //   imageFile: null,
    // });
  };

  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExercise({
      ...exercise,
      [e.target.name]: e.target.value,
    });
  };
  const addExerciseToWorkout = () => {
    console.log(exercise);
    if (
      exercise.name === "" ||
      exercise.description === "" ||
      exercise.sets === 0 ||
      exercise.reps === 0 ||
      exercise.imageFile === null
    ) {
      toast.error("Please fill all the fields", {
        position: "top-center",
      });
      return;
    }
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, exercise],
    });
  };
  const deleteExerciseFromWorkout = (index: number) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.filter((exercise, i) => i !== index),
    });
  };
  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("myimage", image);
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/image-upload/uploadimage`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log("Image uploaded successfully:", data.imageUrl);
        return data.imageUrl; // Ensure this is the correct key from the backend
      } else {
        console.error("Failed to upload the image:", await response.text());
        return null;
      }
    } catch (error) {
      console.error("Error during image upload:", error);
      return null;
    }
  };
  
  const checkLogin = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/checklogin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  
    if (response.ok) {
      // Admin is authenticated
      console.log('Admin is authenticated');
    } else {
      // Admin is not authenticated
      console.log('Admin is not authenticated');
      window.location.href = '/adminauth/login';
    }
  };
  const saveWorkout = async () => {
    await checkLogin(); 
  
    // Validate form fields
    if (
      !workout.name ||
      !workout.description ||
      workout.durationInMinutes === 0 ||
      !workout.imageFile ||
      workout.exercises.length === 0
    ) {
      toast.error("Please fill all the fields", {
        position: "top-center",
      });
      return;
    }
  
    // Upload workout image
    if (workout.imageFile) {
      const imageURL = await uploadImage(workout.imageFile);
      if (!imageURL) {
        toast.error("Failed to upload workout image", {
          position: "top-center",
        });
        return;
      }
      workout.imageURL = imageURL;
    }
  
    // Upload exercise images
    for (let i = 0; i < workout.exercises.length; i++) {
      const exercise = workout.exercises[i];
      if (exercise.imageFile) {
        const imgURL = await uploadImage(exercise.imageFile);
        if (!imgURL) {
          toast.error(`Failed to upload image for exercise: ${exercise.name}`, {
            position: "top-center",
          });
          return;
        }
        exercise.imageURL = imgURL;
      }
    }
  
    // Send workout to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/workoutPlans/workouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workout),
      credentials: "include",
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log("Workout created successfully", data);
      toast.success("Workout created successfully", {
        position: "top-center",
      });
    } else {
      console.error("Workout creation failed", response.statusText);
      toast.error("Workout creation failed", {
        position: "top-center",
      });
    }
  };
  
  return (
    <div className="formpage">
      <h1 className="title">add workout</h1>
      <input
        type="text"
        placeholder="workout name"
        name="name"
        value={workout.name}
        onChange={handleWorkoutChange}
      />

      <textarea
        placeholder="Workout description"
        name="description"
        value={workout.description}
        onChange={(e) => {
          setWorkout({
            ...workout,
            description: e.target.value,
          });
        }}
        rows={5}
        cols={50}
      />

      <label htmlFor="durationInMinutes">Duration in Minutes</label>
      <input
        type="number"
        placeholder="Workout Duration"
        name="durationInMinutes"
        value={workout.durationInMinutes}
        onChange={handleWorkoutChange}
      />

      <input
        type="file"
        placeholder="Workout Image"
        name="workoutImage"
        onChange={(e) =>
          setWorkout({
            ...workout,
            imageFile: e.target.files![0],
          })
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 className="title">Add Exercise to Workout</h2>
        <input
          type="text"
          placeholder="Exercise Name"
          name="name"
          value={exercise.name}
          onChange={handleExerciseChange}
        />
        <textarea
          placeholder="Exercise Description"
          name="description"
          value={exercise.description}
          onChange={(e) => {
            setExercise({
              ...exercise,
              description: e.target.value,
            });
          }}
          rows={5}
          cols={50}
        />
        <label htmlFor="sets">Sets</label>
        <input
          type="number"
          placeholder="Sets"
          name="sets"
          value={exercise.sets}
          onChange={handleExerciseChange}
        />
        <label htmlFor="reps">Reps</label>
        <input
          type="number"
          placeholder="Reps"
          name="reps"
          value={exercise.reps}
          onChange={handleExerciseChange}
        />
        <input
          type="file"
          placeholder="Exercise Image"
          name="exerciseImage"
          onChange={(e) => {
            setExercise({
              ...exercise,
              imageFile: e.target.files![0],
            });
          }}
        />
        <button
          onClick={(e) => {
            addExerciseToWorkout(e);
          }}
        >
          Add Exercise
        </button>
      </div>
      <div className="exercises">
        <h1 className="title">Exercises</h1>
        {workout.exercises.map((exercise, index) => (
          <div className="exercise" key={index}>
            <h2>{exercise.name}</h2>
            <p>{exercise.description}</p>
            <p>{exercise.sets}</p>
            <p>{exercise.reps}</p>
            <img
              src={
                exercise.imageFile
                  ? URL.createObjectURL(exercise.imageFile)
                  : exercise.imageURL
              }
              alt=""
            />
            <button onClick={() => deleteExerciseFromWorkout(index)}>
              delete
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={(e) => {
          saveWorkout(e);
        }}
      >
        add workout
      </button>
    </div>
  );
};

export default page;
