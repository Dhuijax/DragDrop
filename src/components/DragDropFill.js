import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import data from '../data.json';

const Draggable = ({ id, children, style }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id
  });

  const draggableStyle = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
    ...style
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={draggableStyle}>
      {children}
    </div>
  );
};

const Droppable = ({ id, children, onDrop }) => {
  const { isOver, setNodeRef } = useDroppable({
    id
  });

  const droppableStyle = {
    padding: '10px',
    border: '1px dashed gray',
    backgroundColor: isOver ? 'lightblue' : 'white',
    textAlign: 'center',
    width: '100px'
  };

  return (
    <div ref={setNodeRef} style={droppableStyle} onDrop={onDrop}>
      {children}
    </div>
  );
};

const DragDropQuiz = () => {
  const { paragraph, blanks, dragWords } = data.question;
  const [userAnswers, setUserAnswers] = useState({});
  const [dragItems, setDragItems] = useState(dragWords);

  const updateParagraph = () => {
    let updatedParagraph = paragraph;
    blanks.forEach((blank) => {
      const answer = userAnswers[blank.id] || '_';
      updatedParagraph = updatedParagraph.replace(
        '[_input]',
        `<span style="border-bottom: 1px solid black; padding: 2px 8px;">${answer}</span>`
      );
    });
    return updatedParagraph;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && over.id) {
      const blank = blanks.find((b) => b.id === parseInt(over.id));
      const draggedWord = dragItems.find((item) => item.id === parseInt(active.id));

      if (blank && draggedWord.word === blank.correctAnswer) {
        setUserAnswers((prevAnswers) => ({
          ...prevAnswers,
          [blank.id]: draggedWord.word
        }));

        setDragItems((prevItems) =>
          prevItems.filter((item) => item.id !== draggedWord.id)
        );
      }
    }
  };

  const checkAnswers = () => {
    const isCorrect = blanks.every((blank) => userAnswers[blank.id] === blank.correctAnswer);
    alert(isCorrect ? 'Chính xác!' : 'Sai!');
  };

  return (
    <div>
      <h3>Điền vào chỗ trống:</h3>
      <p
        dangerouslySetInnerHTML={{
          __html: updateParagraph()
        }}
      />

      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          {blanks.map((blank) => (
            <Droppable key={blank.id} id={`${blank.id}`}>
              {userAnswers[blank.id] || '_'}
            </Droppable>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          {dragItems.map((item) => (
            <Draggable key={item.id} id={`${item.id}`} style={{
              padding: '10px',
              backgroundColor: item.color === 'red' ? 'red' : 'lightgrey',
              color: item.color === 'red' ? 'white' : 'black'
            }}>
              {item.word}
            </Draggable>
          ))}
        </div>
      </DndContext>

      <button onClick={checkAnswers} style={{ marginTop: '20px' }}>
        Submit
      </button>
    </div>
  );
};

export default DragDropQuiz;
