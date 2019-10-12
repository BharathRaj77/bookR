using System;
using System.Linq.Expressions;

namespace UCB.Template.Domain
{
    public class Sort<T>
    {
        public Sort(Expression<Func<T, object>> sortExpression) : this(sortExpression, true)
        {
        }

        public Sort(Expression<Func<T, object>> sortExpression, bool ascending)
        {
            Ascending = ascending;
            Expression = sortExpression;
        }

        public bool Ascending { get; }
        public Expression<Func<T, object>> Expression { get; }
    }
}