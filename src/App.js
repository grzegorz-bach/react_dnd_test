import React, { useState } from 'react';
import './App.css';

import initState from './initState';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function App() {
  const [state, setState] = useState(initState);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = result => {
    if (result.destination === null) {
      console.log('błąd!')
    } else if (result.source.droppableId === result.destination.droppableId) {
      setState({
        ...state,
        columns: {
          ...state.columns,
          [result.source.droppableId]: {
            ...state.columns[result.source.droppableId],
            items: reorder(state.columns[result.source.droppableId].items, result.source.index, result.destination.index)
          }
        }
      })
    } else {
      let oldColumn = Array.from(state.columns[result.source.droppableId].items);
      let newColumn = Array.from(state.columns[result.destination.droppableId].items);
      const [removed] = oldColumn.splice(result.source.index, 1);
      newColumn = [...newColumn.slice(0, result.destination.index), removed, ...newColumn.slice(result.destination.index),];
      setState({
        ...state,
        columns: {
          ...state.columns,
          [result.source.droppableId]: {
            ...state.columns[result.source.droppableId],
            items: oldColumn
          },
          [result.destination.droppableId]: {
            ...state.columns[result.destination.droppableId],
            items: newColumn
          }
        }
      })
      console.log(oldColumn);
      console.log(newColumn);
    }



  }
  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="container">
          {state.columnOrder.map(columnId => (
            <div key={columnId} id={columnId} className="column">
              <h2>{state.columns[columnId].title}</h2>
              <Droppable droppableId={columnId} isDropDisabled={columnId === 'column-1'}>
                {provided => (
                  <ul className="list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {state.columns[columnId].items.map((itemId, index) => (
                      <Draggable key={itemId} draggableId={itemId} index={index} style={{ margin: '10px auto' }}>
                        {(provided, snapshot) => (
                          <li className="list-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {state.itemsList[itemId].content}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {columnId !== 'column-1' ? provided.placeholder : ''}
                  </ul>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
