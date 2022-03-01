import React from 'react'
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

export default function Pagination(props) {

  const pageSize = props.pageSize
  const currentPage = props.currentPage
  const setCurrentPage = props.setCurrentPage
  const totalPageCount = Math.round(props.data.length / pageSize )
  const siblingsCount = 1
  const totalPageNumbers = siblingsCount + 5
  const DOTS = '...'
  let pages = [], pagesToRender = []

  const range = (start, end) => {
    let length = end - start + 1
    return Array.from({length}, (_, idx) => idx + start)
  }

  const onNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const onPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPageCount)
  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2
  const firstPageIndex = 1
  const lastPageIndex = totalPageCount

  if(!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingsCount
    let leftRange = range(1, leftItemCount)
    pagesToRender = [...leftRange, DOTS, totalPageCount]
  }

  if(shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingsCount
    let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount)
    pagesToRender = [firstPageIndex, DOTS, ...rightRange]
  }

  if(shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = range(leftSiblingIndex, rightSiblingIndex)
    pagesToRender = [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
  }

  if (totalPageNumbers >= totalPageCount) {
    pagesToRender = range(1, totalPageCount)
  }

  pages = pagesToRender.map(pageNumber => {
    if (pageNumber === DOTS) {
      return <li key={uuidv4()} className="pagination-item dots">&#8230;</li>;
    }

    return (
      <li
        className={classnames(
          "pagination-item",
          {selected: currentPage === pageNumber}
          )}
        key={uuidv4()}
        onClick={() => setCurrentPage(pageNumber)}
        >
          {pageNumber}
      </li>
    )
  })

  return (
    <div className="w-100">
      <ul className="flex">
        <li key={uuidv4()} className="pagination-item">
          <div className={classnames(
          "arrow left",
          {disabled: currentPage === 0 }
          )}
          onClick={onPrevious} />
        </li>
        {pages}
        <li key={uuidv4()} className="pagination-item">
          <div className={classnames(
          "arrow right",
          {disabled: currentPage === totalPageCount }
          )}
          onClick={onNext} />
        </li>
      </ul>
    </div>
  )
}
