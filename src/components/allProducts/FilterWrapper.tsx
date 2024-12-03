import {
  type ChangeEvent,
  type FC,
  useContext,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useSearchParams } from 'react-router-dom';

import clsx from 'clsx';
import type { ICategory } from 'interfaces/ICategory';
import type { IIndustry } from 'interfaces/IIndustry';
import type { IManufacturer } from 'interfaces/IManufacturer';

import SearchFilter from './SearchFilter';

import { LanguageContext } from '@components/SharedLayout';
import SvgIcon from '@components/common/SvgIcon';

import subtractSearchParam from '@utils/subtractSearchParam';

import { filters } from '@enums/filters';
import { Filter } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';
import { LanguageKeys } from '@enums/languageKeys';
import getProductName from '@utils/getProductName';

interface IFilterWrapperProps {
  filterName: string;
  items: ICategory[] | IManufacturer[] | IIndustry[];
  isLoading: boolean;
  keyword: string;
  setKeyword: (value: string) => void;
}
const FilterWrapper: FC<IFilterWrapperProps> = ({
  filterName,
  items,
  isLoading,
  keyword,
  setKeyword,
}) => {
  const context = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(
    filterName === filters.Category ? true : false
  );
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!context) {
    throw new Error('LanguageContext must be used within a LanguageProvider');
  }

  const { language } = context;

  const isItemSelected = (item: string) =>
    searchParams.getAll(filterName).includes(item);

  const handleSelectedOption = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(searchParams => {
      if (!event.target.checked) {
        subtractSearchParam(searchParams, event.target.value, filterName);
        return searchParams;
      }

      searchParams.append(filterName, event.target.value);
      return searchParams;
    });
  };

  return (
    <fieldset>
      <div
        className="flex items-center justify-between py-[10px]"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <legend className="font-openSans text-[12px] font-semibold text-title">
          {filterName === filters.Category && t(Filter.Category)}
          {filterName === filters.Manufacturer && t(Filter.Manufacturer)}
          {filterName === filters.Industry && t(Filter.Industry)}
        </legend>

        <SvgIcon
          iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
          size={{ width: 10, height: 10 }}
        />
      </div>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[246px]' : 'max-h-0'
        )}
      >
        <SearchFilter keyword={keyword} setKeyword={setKeyword} />
        <div className="flex h-[174px] flex-col gap-[16px] overflow-y-scroll">
          {items.map(item => {
            return (
              <SkeletonTheme baseColor="#E1E1E1" highlightColor="#F2F2F2">
                <div className="flex gap-[6px]">
                  {!isLoading ? (
                    <input
                      onChange={handleSelectedOption}
                      type="checkbox"
                      checked={isItemSelected(
                        filterName === filters.Manufacturer
    ? String(item.name)
    : String(getProductName(item.name, LanguageKeys.EN))
                      )}
                      id={item._id}
                      name={filterName}
                      className="h-[16px] w-[16px] cursor-pointer appearance-none rounded-[4px] after:block after:h-[16px] after:w-[16px] after:rounded-[4px] after:border after:border-[rgba(0,32,52,.12)] checked:after:bg-primary checked:after:bg-check-icon checked:after:bg-center checked:after:bg-no-repeat"
                      value={filterName === filters.Manufacturer
    ? String(item.name)
    : String(getProductName(item.name, LanguageKeys.EN))
  }
                    />
                  ) : (
                    <Skeleton width={16} />
                  )}

                  {!isLoading ? (
                    <label
                      className="font-openSans text-[12px] capitalize"
                      htmlFor={item._id}
                    >
                      {filterName === filters.Manufacturer
    ? String(item.name)
    : String(getProductName(item.name, language))
  }
                    </label>
                  ) : (
                    <Skeleton width={150} />
                  )}
                </div>
              </SkeletonTheme>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
};

export default FilterWrapper;
