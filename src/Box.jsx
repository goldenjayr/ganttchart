import { useDrag } from 'react-dnd';
const style = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
};
export const Box = function Box({ children, name, className }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'box',
        item: { name },
        end: (item, monitor, component) => {
            const dropResult = monitor.getDropResult();

            // if (item && dropResult) {
            //     alert(`You dropped ${item.name} into ${dropResult.name}!`);
            // }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }));
    const opacity = isDragging ? 0.4 : 1;
    return (<div ref={drag} role="Box" className={className} data-testid={`box-${name}`} onDragEnd={(e) => {
			const ev = new MouseEvent('click', {
				'view': window,
        'bubbles': true,
        'cancelable': true,
        'clientX': e.clientX,
        'clientY': e.clientY
			})
			const el = document.elementFromPoint(e.clientX, e.clientY)
			ev.initEvent('click', true, true)
			el.dispatchEvent(ev)
		}}  >
			{children}
		</div>);
};
